import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AuthorDashboard from './pages/AuthorDashboard.jsx';
import EditorDashboard from './pages/EditorDashboard.jsx';
import ReviewerDashboard from './pages/ReviewerDashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import PublishedPapersPage from './pages/PublishedPapersPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ToastContainer from './components/ToastContainer.jsx';

const App = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard/author"
          element={<ProtectedRoute allowedRoles={["AUTHOR", "ADMIN"]} element={<AuthorDashboard />} />}
        />
        <Route
          path="/dashboard/editor"
          element={<ProtectedRoute allowedRoles={["EDITOR", "ADMIN"]} element={<EditorDashboard />} />}
        />
        <Route
          path="/dashboard/reviewer"
          element={<ProtectedRoute allowedRoles={["REVIEWER", "ADMIN"]} element={<ReviewerDashboard />} />}
        />
        <Route
          path="/dashboard/admin"
          element={<ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminPanel />} />}
        />
        <Route path="/published" element={<PublishedPapersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
    <ToastContainer />
  </div>
);

export default App;
