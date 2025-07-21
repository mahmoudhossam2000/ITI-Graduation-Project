import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import ComplaintForm from "./Components/ComplaintForm";
import ComplaintSearch from "./Components/ComplaintSearch";
import { ToastContainer } from "react-toastify";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <>
      <ToastContainer className='text-lg'/>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/submitComplaint" element={<ComplaintForm />} />
          <Route path="/traceComplaint" element={<ComplaintSearch />} />

          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
