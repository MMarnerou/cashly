import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashly",
  description: "Account summary and recent transactions",
  icons: [{ url: "/icon.svg", type: "image/svg+xml" }],
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en">
      {/* Browser extensions such as password managers add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
export default RootLayout
