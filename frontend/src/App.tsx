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

import ExhibitionsPage from "./pages/ExhibitionsPage";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistsPage from "./pages/ArtistsPage";
import ScreensPage from "./pages/ScreensPage";
import UserPage from "./pages/UserPage";

import NewExhibitionPage from "./pages/NewExhibitionPage";
import NewArtworkPage from "./pages/NewArtworkPage";
import NewArtistPage from "./pages/NewArtistPage";
import NewScreenPage from "./pages/NewScreenPage";
import NewUserPage from "./pages/NewUserPage";
import LandingPage from "./pages/LandingPage";

import ExhibitionScreenStatic from "./pages/ExhibitionScreenStatic";
import ArtworkScreenStatic from "./pages/ArtworkScreenStatic";
import ArtistScreenStatic from "./pages/ArtistScreenStatic";
import ArtworkScreenPuzzle from "./pages/ArtworkScreenPuzzle";
import ExhibitionScreenChat from "./pages/ExhibitionScreenChat";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function WebsiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1 px-8 py-10">
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Display Screens */}

        <Route
          path="/display/static/exhibition/:id"
          element={<ExhibitionScreenStatic />}
        />

        <Route
          path="/display/static/artwork/:id"
          element={<ArtworkScreenStatic />}
        />

        <Route
          path="/display/static/artist/:id"
          element={<ArtistScreenStatic />}
        />

        <Route
          path="/display/dynamic/puzzle/artwork/:id"
          element={<ArtworkScreenPuzzle />}
        />
        <Route
          path="/display/dynamic/chat/exhibition/:id"
          element={<ExhibitionScreenChat />}
        />

        {/* "Normale Website (AuthProvider gilt hier für die gesamte Website.) */}

        <Route
          path="*"
          element={
            <AuthProvider>
              <WebsiteLayout />
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
// function WebsiteLayout() {
//   return (
//     <div className="min-h-screen bg-white text-black">
//       <Header />

//       <main className="px-8 py-10">
//         <Routes>
//           {/* Öffentliche Seiten */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/imprint" element={<ImprintPage />} />
//           <Route path="/privacy" element={<PrivacyPage />} />

//           {/* Geschützter Bereich für eingeloggte User:innen */}
//           <Route
//             path="/landingpage"
//             element={
//               <ProtectedRoute>
//                 <LandingPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artworks"
//             element={
//               <ProtectedRoute>
//                 <ArtworksPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artworks/new"
//             element={
//               <ProtectedRoute>
//                 <NewArtworkPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artworks/:id"
//             element={
//               <ProtectedRoute>
//                 <NewArtworkPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/exhibitions"
//             element={
//               <ProtectedRoute>
//                 <ExhibitionsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/exhibitions/new"
//             element={
//               <ProtectedRoute>
//                 <NewExhibitionPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/exhibitions/:id"
//             element={
//               <ProtectedRoute>
//                 <NewExhibitionPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/screens"
//             element={
//               <ProtectedRoute>
//                 <ScreensPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/screens/new"
//             element={
//               <ProtectedRoute>
//                 <NewScreenPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artists"
//             element={
//               <ProtectedRoute>
//                 <ArtistsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artists/new"
//             element={
//               <ProtectedRoute>
//                 <NewArtistPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/artists/:id"
//             element={
//               <ProtectedRoute>
//                 <NewArtistPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/user"
//             element={
//               <ProtectedRoute>
//                 <UserPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/landingpage/user/new"
//             element={
//               <ProtectedRoute>
//                 <NewUserPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Display Screens */}
//           <Route
//             path="/display/static/exhibition/:id"
//             element={<ExhibitionScreenStatic />}
//           />

//           <Route
//             path="/display/static/artwork/:id"
//             element={<ArtworkScreenStatic />}
//           />

//           <Route
//             path="/display/static/artist/:id"
//             element={<ArtistScreenStatic />}
//           />

//           <Route
//             path="/display/dynamic/puzzle/artwork/:id"
//             element={<ArtworkScreenPuzzle />}
//           />

//           <Route
//             path="/display/dynamic/chat/exhibition/:id"
//             element={<ExhibitionScreenChat />}
//           />

//           <Route path="*" element={<WebsiteLayout />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
