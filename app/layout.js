import "./globals.css";

export const metadata = {
  title: "Files",
  description: "Read, download, edit, and create pdfs" ,
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
 