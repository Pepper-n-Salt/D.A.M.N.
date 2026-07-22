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
import LandingPage from "./pages/LandingPage";

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
            <Route path="/landingpage" element={<LandingPage />} />
            <Route path="/landingpage/artworks" element={<ArtworksPage />} />
            <Route
              path="/landingpage/artworks/new"
              element={<NewArtworkPage />}
            />
            <Route
              path="/landingpage/exhibitions"
              element={<ExhibitionsPage />}
            />
            <Route
              path="/landingpage/exhibitions/new"
              element={<NewExhibitionPage />}
            />
            <Route path="/landingpage/screens" element={<ScreensPage />} />
            <Route
              path="/landingpage/screens/new"
              element={<NewScreenPage />}
            />
            <Route path="/landingpage/user" element={<UserPage />} />
            <Route path="/landingpage/user/new" element={<NewUserPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
