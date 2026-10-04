import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Store in-memory pentru token-uri de resetare parolă
// (Ideal, și acestea ar trebui puse în baza de date, dar e OK pentru învățare)
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

// Generează un token pseudo-aleator de 32 de caractere (hex)
function generateToken(): string {
  const arr = new Uint8Array(16);
  for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authController = {
  // Creează un utilizator nou
  register: async (data: any) => {
    if (!data.email) throw new Error("Emailul este obligatoriu.");
    
    const emailNorm = data.email.trim().toLowerCase();
    
    // Validare strictă a formatului de email folosind un RegExp standard
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      throw new Error("Adresa de email nu are un format valid (ex: nume@domeniu.com).");
    }

    // 🔒 RESTRICTIE DOMENIU
    const requiredDomain = '@nextapp.ro';
    if (!emailNorm.endsWith(requiredDomain)) {
      throw new Error(`Ne pare rău, dar numai angajații (email-uri care se termină în ${requiredDomain}) se pot înregistra.`);
    }

    // Verificăm dacă email-ul există deja în baza de date (Prisma)
    const existingUser = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existingUser) {
      throw new Error("Acest email este deja folosit.");
    }

    const role = emailNorm === 'admin@nextapp.ro' ? 'ADMIN' : 'USER';

    // 🔐 Hashing-ul parolei (transformă "123456" în ceva de genul "$2a$10$w...Y")
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Salvăm în baza de date reală SQLite
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: emailNorm,
        password: hashedPassword, // Acum salvăm hash-ul, nu parola în clar!
        role: role
      }
    });

    return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  },

  // Verifică credențialele
  login: async (data: any) => {
    if (!data.email) throw new Error("Emailul este obligatoriu.");
    const emailNorm = data.email.trim().toLowerCase();

    // Căutăm utilizatorul cu Prisma
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    
    // Verificăm dacă utilizatorul există
    if (!user) {
      throw new Error("Email sau parolă incorectă.");
    }

    // 🔐 Comparam parola introdusă cu hash-ul din baza de date
    const isMatch = await bcrypt.compare(data.password, user.password);
    
    if (!isMatch) {
      throw new Error("Email sau parolă incorectă.");
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  // Găsește utilizatorul după email (fără parolă)
  getUserByEmail: async (email: string) => {
    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
  },

  // Actualizează avatarul utilizatorului
  updateAvatar: async (email: string, avatarData: string) => {
    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) throw new Error("Utilizatorul nu există.");
    
    const updatedUser = await prisma.user.update({
      where: { email: emailNorm },
      data: { avatar: avatarData }
    });
    
    return updatedUser.avatar;
  },

  // Generează un token de resetare parolă
  createResetToken: async (email: string): Promise<string> => {
    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: emailNorm } });

    // Nu dezvăluim dacă email-ul există sau nu (securitate anti-enumerare)
    if (!user) return generateToken();

    // Invalidăm orice token anterior pentru același email
    for (const [token, data] of resetTokens.entries()) {
      if (data.email === emailNorm) resetTokens.delete(token);
    }

    const token = generateToken();
    resetTokens.set(token, {
      email: emailNorm,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minute
    });

    return token;
  },

  // Resetează parola folosind token-ul valid
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    const record = resetTokens.get(token);

    if (!record) throw new Error("Token invalid sau deja folosit.");
    if (Date.now() > record.expiresAt) {
      resetTokens.delete(token);
      throw new Error("Token-ul a expirat. Solicită un link nou.");
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Parola trebuie să aibă cel puțin 6 caractere.");
    }

    const user = await prisma.user.findUnique({ where: { email: record.email } });
    if (!user) throw new Error("Utilizatorul nu mai există.");

    // 🔐 Hashing-ul noii parole
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizăm parola în baza de date
    await prisma.user.update({
      where: { email: record.email },
      data: { password: hashedNewPassword }
    });

    // Invalidăm token-ul după folosire
    resetTokens.delete(token);
  },

  // Verifică dacă un token de reset este valid
  validateResetToken: (token: string): boolean => {
    const record = resetTokens.get(token);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      resetTokens.delete(token);
      return false;
    }
    return true;
  },
};