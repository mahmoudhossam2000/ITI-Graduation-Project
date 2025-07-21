import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PlateFormFeatures from "../Components/SectionsLanding/PlateFormFeatures";
import HeroSection from "../Components/SectionsLanding/HeroSection";
import PrivacySection from "../Components/SectionsLanding/PrivacySection";
import AboutPlatform from "../Components/SectionsLanding/AboutSection";
import HowItWorks from "../Components/SectionsLanding/HowWork";
import DepartmentsBar from "../Components/SectionsLanding/DepartmentsBar";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <PlateFormFeatures />
      <PrivacySection />
      <AboutPlatform />
      <HowItWorks />
      <DepartmentsBar />
      <Footer />
    </>
  );
}
