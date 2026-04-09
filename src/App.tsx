import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Top from "./Top";
import WorkKiviaq from "./pages/WorkKiviaq";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/works/kiviaq-pharmacy" element={<WorkKiviaq />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
