import type { Metadata } from "next";
import "./globals.css";
import { CloudLabProvider } from "@/components/provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "WD CloudLab — The cloud for physical experimentation",
  description: "Turn unused laboratory capacity into on-demand scientific insight."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CloudLabProvider><SiteHeader />{children}</CloudLabProvider></body></html>;
}
