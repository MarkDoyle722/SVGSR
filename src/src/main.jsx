import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";

import App from "./App.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import RecordDetails from "./pages/RecordDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRecords from "./pages/admin/AdminRecords.jsx";
import AdminRecordEditor from "./pages/admin/AdminRecordEditor.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/record/:slug" element={<RecordDetails />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="records" element={<AdminRecords />} />
              <Route path="records/new" element={<AdminRecordEditor />} />
              <Route path="records/:id/edit" element={<AdminRecordEditor />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
