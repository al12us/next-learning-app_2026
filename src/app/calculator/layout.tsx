import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator & Convertor | NextApp Hub',
  description: 'Calculator matematic interactiv și convertor de baze (Zecimal, Binar, Hexazecimal) construit cu Client Components în Next.js.',
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
