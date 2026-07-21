import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-gray-200 px-8 py-6">
      <div className="mb-20">
        <div className="leading-none">
          <p className="-ml-1 text-6xl tracking-[0.02em]">D.A.M.N.</p>
          <p className="mt-1 text-sm">Digital Artwork Management Network</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <nav className="flex gap-10 text-sm uppercase tracking-[0.2em]">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center uppercase gap-4">
          <Link
            to="/login"
            className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
