import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Audit Tool",
  description:
    "Analyze your website's SEO performance and get actionable recommendations",
  generator: "Akash Badole",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
