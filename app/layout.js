import "./globals.css";

export const metadata = {
  title: "Files",
  description: "Read, download, edit, and create pdfs" ,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-[#1b1b1b]">
        {children}
        </body>
    </html>
  );
}
 
