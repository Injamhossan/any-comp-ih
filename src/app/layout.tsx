import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const proxima = localFont({
  src: "../assets/fonts/Proxima_Nova.ttf",
  variable: "--font-proxima",
  weight: "100 900",
});

const redhat = localFont({
  src: "../assets/fonts/RedHatDisplay.ttf",
  variable: "--font-redhat",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ST Comp Holdings Sdn Bhd",
  description: "ST Comp Holdings Sdn Bhd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${proxima.variable} ${redhat.variable} antialiased`}
      >
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
