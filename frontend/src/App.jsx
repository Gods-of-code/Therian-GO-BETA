import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AppLayout from "./layouts/AppLayout";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route index element={<Onboarding />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="app" element={<AppLayout />}>
          <Route path="discover" element={<Discover />} />
          <Route path="matches" element={<Matches />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>

  );
}
