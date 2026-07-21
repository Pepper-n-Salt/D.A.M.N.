import Header from "./Header";
import Footer from "./Footer";
// import { LanguageProvider } from "../context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <LanguageProvider> */}
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />

        <main className="flex-1 w-full px-8 py-24">{children}</main>

        <Footer />
      </div>
      {/* </LanguageProvider> */}
    </div>
  );
}
