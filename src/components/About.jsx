import React from "react";

import { COMPANY } from "../siteConfig";

const About = () => (
  <section id="about" className="section" aria-labelledby="about-title">
    <div className="section__inner about">
      <p className="section__eyebrow">About us</p>
      <h2 id="about-title" className="section__title">
        A Kisumu company protecting sites across Kenya
      </h2>
      <p>
        {COMPANY.name} is a registered security solutions provider founded in{" "}
        {COMPANY.foundedYear} and based on Technology Road, Kisumu. We combine
        disciplined, professionally trained officers with modern technology:
        guards, alarms, CCTV, canine units, VIP protection, electric fencing and
        fire safety, from one team you can reach any time.
      </p>
      <p className="about__mission">
        <strong>Our mission:</strong> reliable, affordable security that meets
        international standards, so you can focus on what matters to you.
      </p>
    </div>
  </section>
);

export default About;
