import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Lastrofit — seu começo em movimento", template: "%s | Lastrofit" },
  description: "Um espaço simples para começar e acompanhar sua jornada de treinos.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#173e36" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className="min-h-svh antialiased"><a href="#conteudo" className="skip-link">Pular para o conteúdo</a>{children}</body></html>;
}
