import React from "react";
import { MotionConfig } from "framer-motion";

import Home from "./components/home.jsx";
import About from "./components/about.jsx";
// CSR section is switched off for now. To bring it back, uncomment this
// import and the <Values /> line below.
// import Values from "./components/values.jsx";
import Stats from "./components/stats.jsx";
import Reviews from "./components/reviews.jsx";
import Footer from "./components/footer.jsx";

// Order follows the buyer's journey: headline numbers, what we do, client
// reviews, values, then contact (Footer renders the contact cards, form and CTA).
function App() {
  return (
    // reducedMotion="user" makes every framer-motion reveal respect the
    // visitor's "reduce motion" operating-system setting.
    <MotionConfig reducedMotion="user">
      <div className="App">
        <a href="#main" className="sr-skip-link">
          Skip to main content
        </a>
        <Home />
        <main id="main">
          <Stats />
          <About />
          <Reviews />
          {/* <Values /> */}
          <Footer />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
