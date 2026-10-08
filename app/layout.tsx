import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashly",
  description: "Account summary and recent transactions",
  icons: [{ url: "/icon", type: "image/svg+xml" }],
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
export default RootLayout
