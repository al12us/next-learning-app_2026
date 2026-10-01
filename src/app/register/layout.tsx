import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cont Nou 🚀 | NextApp',
  description: 'Alătură-te comunității noastre și începe să postezi!',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
