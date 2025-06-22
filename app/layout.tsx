import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Storybook Studio",
  description: "AI-crafted storybooks at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.className} bg-[#F1F2F6] flex flex-col min-h-screen `}>
        <div>
          {/* Header */}
          <Header />
          {children}
          {/* Toaster */}
        </div>
      </body>
    </html>
  );
}
