import "./globals.css";

export const metadata = {
  title: "Coffee Shop Expense Tracker",
  description: "Expense approval workflow for a coffee shop business"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
