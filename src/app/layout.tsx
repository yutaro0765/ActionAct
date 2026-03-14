// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
}