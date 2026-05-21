"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CallFAB from "./CallFAB";
import WhatsAppFAB from "./WhatsAppFAB";

const SHELL_EXCLUDED = ["/login", "/register"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = SHELL_EXCLUDED.includes(pathname) || pathname.startsWith("/admin");

  return (
    <>
      {!isExcluded && <Navbar />}
      <main>{children}</main>
      {!isExcluded && <Footer />}
      {!isExcluded && <CallFAB />}
      {!isExcluded && <WhatsAppFAB />}
    </>
  );
}
