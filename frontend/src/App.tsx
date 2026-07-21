import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import ImprintPage from "./pages/ImprintPage";
import PrivacyPage from "./pages/PrivacyPage";
import ArtworksPage from "./pages/ArtworksPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ScreensPage from "./pages/ScreensPage";
import UserPage from "./pages/UserPage";
import NewArtworkPage from "./pages/NewArtworkPage";
import NewExhibitionPage from "./pages/NewExhibitionPage";
import NewScreenPage from "./pages/NewScreenPage";
import NewUserPage from "./pages/NewUserPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black">
        <Header />
        <main className="px-8 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/imprint" element={<ImprintPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/artworks" element={<ArtworksPage />} />
            <Route path="/artworks/new" element={<NewArtworkPage />} />
            <Route path="/exhibitions" element={<ExhibitionsPage />} />
            <Route path="/exhibitions/new" element={<NewExhibitionPage />} />
            <Route path="/screens" element={<ScreensPage />} />
            <Route path="/screens/new" element={<NewScreenPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/user/new" element={<NewUserPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
