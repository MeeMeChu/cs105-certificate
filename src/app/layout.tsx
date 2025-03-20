import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { CssBaseline } from "@mui/material";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProvider } from "@context/app-context";
import SessionProvider from '@components/auth/SessionProvider'
import "./globals.css";

const notoThai = Noto_Sans_Thai({ subsets: ["thai"], weight: "400" });
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CS Event",
  description: "Generated by create next app",
  icons: {
    icon: "/images/logo.jpg",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialMode = (cookieStore.get("color-mode")?.value as "light" | "dark") || "light";
  const session = await getServerSession()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${notoThai.className}`}
      >
        <AppRouterCacheProvider>
          <AppProvider initialMode={initialMode}> 
            <CssBaseline />
            {/* <Header /> */}
            <SessionProvider session={session}>{children}</SessionProvider>
          </AppProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
