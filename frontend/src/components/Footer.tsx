import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-8 py-8">
      <div className="flex justify-between items-center text-sm uppercase tracking-[0.2em]">
        <p className="text-gray-400">© D.A.M.N. {new Date().getFullYear()}</p>

        <nav className="flex gap-8">
          <Link to="/imprint">Imprint</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
