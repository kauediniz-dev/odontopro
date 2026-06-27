import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuth } from "@/components/ui/sessionAuth";
import { Toaster } from "sonner";
import { QueryClientContext } from "@/providers/queryclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Odonto PRO - Encontre os melhores profissionais em um único local!",
  description:
    "Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simplificada e eficiente.",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "Odonto PRO - Encontre os melhores profissionais em um único local!",
    description:
      "Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simplificada e eficiente.",
    images: [`${process.env.NEXT_PUBLIC_URL}/doctor-hero.png`],
    url: "https://odonto-pro.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <SessionAuth>
          <QueryClientContext>
            <Toaster duration={2500} />
            {children}
          </QueryClientContext>
        </SessionAuth>
      </body>
    </html>
  );
}
