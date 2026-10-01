// Baza de date in-memory pentru utilizatori
let users: any[] = [];

export const authController = {
  // Creează un utilizator nou
  register: (data: any) => {
    if (!data.email) throw new Error("Emailul este obligatoriu.");
    
    const emailNorm = data.email.trim().toLowerCase();
    
    // Validare strictă a formatului de email folosind un RegExp standard
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      throw new Error("Adresa de email nu are un format valid (ex: nume@domeniu.com).");
    }

    // 🔒 RESTRICTIE DOMENIU: Permitem doar email-uri interne
    const requiredDomain = '@nextapp.ro';
    if (!emailNorm.endsWith(requiredDomain)) {
      throw new Error(`Ne pare rău, dar numai angajații (email-uri care se termină în ${requiredDomain}) se pot înregistra.`);
    }

    // Verificăm dacă email-ul există deja
    const existingUser = users.find(u => u.email === emailNorm);
    if (existingUser) {
      throw new Error("Acest email este deja folosit.");
    }

    // 👑 ATRIBUIRE ROL (Hardcoded pentru testare)
    const role = emailNorm === 'admin@nextapp.ro' ? 'ADMIN' : 'USER';

    // Creăm utilizatorul
    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: emailNorm, // Salvăm versiunea normalizată
      password: data.password, // Parolă în clar DOAR pentru testare locală
      role: role // 'ADMIN' sau 'USER'
    };

    users.push(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  },

  // Verifică credențialele
  login: (data: any) => {
    if (!data.email) throw new Error("Emailul este obligatoriu.");
    const emailNorm = data.email.trim().toLowerCase();

    const user = users.find(u => u.email === emailNorm);
    
    // Verificăm dacă utilizatorul există și parola se potrivește
    if (!user || user.password !== data.password) {
      throw new Error("Email sau parolă incorectă.");
    }

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
};