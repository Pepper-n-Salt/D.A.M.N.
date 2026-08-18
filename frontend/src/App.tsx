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
import ScreenExhibition from "./pages/ScreenExhibition";
import ScreenArtwork from "./pages/ScreenArtwork";
import ScreenArtist from "./pages/ScreenArtist";
import ArtistsPage from "./pages/ArtistsPage";
import NewArtistPage from "./pages/NewArtistPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

              <Route
                path="/landingpage"
                element={
                  <ProtectedRoute>
                    <LandingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/artworks"
                element={
                  <ProtectedRoute>
                    <ArtworksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landingpage/artworks/:id"
                element={
                  <ProtectedRoute>
                    <NewArtworkPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/artworks/new"
                element={
                  <ProtectedRoute>
                    <NewArtworkPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/exhibitions"
                element={
                  <ProtectedRoute>
                    <ExhibitionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landingpage/exhibitions/:id"
                element={
                  <ProtectedRoute>
                    <NewExhibitionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landingpage/exhibitions/new"
                element={
                  <ProtectedRoute>
                    <NewExhibitionPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/screens"
                element={
                  <ProtectedRoute>
                    <ScreensPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/screens/new"
                element={
                  <ProtectedRoute>
                    <NewScreenPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/artists"
                element={
                  <ProtectedRoute>
                    <ArtistsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landingpage/artists/:id"
                element={
                  <ProtectedRoute>
                    <NewArtistPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/landingpage/artists/new"
                element={
                  <ProtectedRoute>
                    <NewArtistPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/display/static/exhibition/:id"
                element={<ScreenExhibition />}
              />

              <Route
                path="/display/static/artwork/:id"
                element={<ScreenArtwork />}
              />

              <Route
                path="/display/static/artist/:id"
                element={<ScreenArtist />}
              />

              <Route
                path="/landingpage/user"
                element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landingpage/user/new"
                element={
                  <ProtectedRoute>
                    <NewUserPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
