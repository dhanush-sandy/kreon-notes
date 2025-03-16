import React from "react";
import LandingHeader from "./components/LandingHeader";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import CallToAction from "./components/CallToActions";
import Footer from "./components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100 to-white">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      <LandingHeader />
      <div className="relative">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <Features />
          <Testimonials />
          <Faq />
          <CallToAction />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
