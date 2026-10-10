import React, { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowWeWork from "./components/HowWeWork";
import Proof from "./components/Proof";
import About from "./components/About";
import Contact from "./components/Contact";
import SiteFooter from "./components/SiteFooter";
import FloatingContact from "./components/FloatingContact";
import "./styles.css";

// One page, one goal: get the visitor to request a quote, call or WhatsApp.
// Order: promise and proof (hero), what we do, why we're different (our
// GPS-verified operations), who we protect, who we are, then contact.
function App() {
  // Service picked from a card's "Get a quote", pre-selected in the form.
  const [chosenService, setChosenService] = useState("");

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <span id="top" />
        <Hero />
        <Services onChooseService={setChosenService} />
        <HowWeWork />
        <Proof />
        <About />
        <Contact chosenService={chosenService} />
      </main>
      <SiteFooter />
      <FloatingContact />
    </>
  );
}

export default App;
