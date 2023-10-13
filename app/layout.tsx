import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RainbowProviders } from "@/providers/RainbowProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { AccountAbstractionProvider } from "@/providers/AccountAbstractionProvider";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XmtpProvider } from "@/providers/XMTPProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "PledgePost",
  description: "PledgePost is a decentralized social media platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountAbstractionProvider>
          <RainbowProviders>
            <XmtpProvider>
              <ThemeProvider attribute="class" defaultTheme="system">
                <ToastContainer newestOnTop />
                <Header />
                {children}
              </ThemeProvider>
            </XmtpProvider>
          </RainbowProviders>
        </AccountAbstractionProvider>
      </body>
    </html>
  );
}
