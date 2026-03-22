import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortcut Vault | The Ultimate Cheat Sheet for Pros",
  description: "A community-driven platform for sharing and discovering shortcuts for Figma, Word, Excel, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="text-xl font-extrabold gradient-text tracking-tight">Shortcut Vault</Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors font-medium">Shortcuts</Link>
            <Link href="/blogs" className="text-slate-400 hover:text-white transition-colors font-medium">Blogs</Link>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
