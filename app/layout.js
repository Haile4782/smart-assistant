export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body className="antialiased bg-[#0b0b1a] text-white">
        {children}
      </body>
    </html>
  );
}