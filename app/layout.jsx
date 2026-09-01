import "./globals.css";

export const metadata = {
  title: "Homeverse - Find your dream house",
  description: "A responsive real estate marketplace built with Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
