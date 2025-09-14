import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Font Awesome imports
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '../../lib/fontawesome'; // Corrected path

// Prevent Font Awesome from adding its own CSS since we did it manually
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Springfield Elementary School",
  description: "Welcome to Springfield Elementary School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <Header />
        <main className="container flex-grow-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
