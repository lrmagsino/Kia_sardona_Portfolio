import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kia G. Sardona | Civil Engineering Portfolio",
  description:
    "Civil engineering student portfolio featuring technical drawing plates, a workbook-based cost estimate, project documentation, software learning areas, and construction safety.",
  openGraph: {
    title: "Kia G. Sardona | Civil Engineering Portfolio",
    description:
      "Technical drawing plates, cost estimation, project documentation, and construction safety.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
