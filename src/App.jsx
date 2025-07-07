import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import ComplaintForm from "./Components/ComplaintForm";
import ComplaintSearch from "./Components/ComplaintSearch";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/submitComplaint" element={<ComplaintForm />} />
          <Route path="/traceComplaint" element={<ComplaintSearch />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
