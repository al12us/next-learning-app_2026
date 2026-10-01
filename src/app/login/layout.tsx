import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In 🔐 | NextApp',
  description: 'Intră în contul tău pentru a putea posta articole.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Acest layout doar "îmbracă" pagina de client și injectează Metadata în <head>
  return <>{children}</>;
}
