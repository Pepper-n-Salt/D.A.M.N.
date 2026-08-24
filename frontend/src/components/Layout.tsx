import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <main className="min-h-screen bg-red-100 px-8 py-24">{children}</main>
      {/* <main className="min-h-[75vh] flex-1 px-8 py-24"> */}

      <Footer />
    </div>
  );
}
