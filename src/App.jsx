import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import ComplaintForm from "./Components/ComplaintForm";
import ComplaintSearch from "./Components/ComplaintSearch";
import Layout from "./Components/features/authority_Dashboard/Layout";
import Dashboard from "./Pages/Dashboard";
import Complaints from "./Pages/Complaints";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/submitComplaint" element={<ComplaintForm />} />
          <Route path="/traceComplaint" element={<ComplaintSearch />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="complaints" element={<Complaints />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
