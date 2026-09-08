import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Pixera Studio — Curated for Bold Ambition",
  description: "A focused digital studio building brands, interfaces, and stories that earn attention. We partner with founders and teams to shape ideas into polished digital products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="bg-[#090706] text-[#f5efe9] antialiased selection:bg-[#C61C09] selection:text-[#090706]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
