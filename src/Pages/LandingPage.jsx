import React, { Suspense } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { InView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SyncLoader from "react-spinners/SyncLoader";

const HeroSection = React.lazy(() =>
  import("../Components/SectionsLanding/HeroSection")
);
const PlateFormFeatures = React.lazy(() =>
  import("../Components/SectionsLanding/PlateFormFeatures")
);
const PrivacySection = React.lazy(() =>
  import("../Components/SectionsLanding/PrivacySection")
);
const AboutPlatform = React.lazy(() =>
  import("../Components/SectionsLanding/AboutSection")
);
const HowItWorks = React.lazy(() =>
  import("../Components/SectionsLanding/HowWork")
);
const DepartmentsBar = React.lazy(() =>
  import("../Components/SectionsLanding/DepartmentsBar")
);
const FAQSection = React.lazy(() =>
  import("../Components/SectionsLanding/AccordingSection")
);

function LazyLoadComponent({ Component }) {
  return (
    <InView triggerOnce={true} threshold={0.2}>
      {({ inView, ref }) => (
        <div ref={ref} style={{ minHeight: "200px" }}>
          {inView ? (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <SyncLoader color="#27548A" />
                </div>
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Component />
              </motion.div>
            </Suspense>
          ) : null}
        </div>
      )}
    </InView>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <LazyLoadComponent Component={HeroSection} />
      <LazyLoadComponent Component={PlateFormFeatures} />
      <LazyLoadComponent Component={PrivacySection} />
      <LazyLoadComponent Component={AboutPlatform} />
      <LazyLoadComponent Component={HowItWorks} />
      <LazyLoadComponent Component={FAQSection} />
      <LazyLoadComponent Component={DepartmentsBar} />
      <Footer />
    </>
  );
}
