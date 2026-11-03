import React from "react";
import { BookLock, ClipboardCheck, MapPinCheck, Siren } from "lucide-react";

// Our own operations system (the Resilience BMS). Client-facing summary
// only: no back-office modules and no staff details. Clients do not log in
// or see locations themselves; the operations team monitors and reports.
const FEATURES = [
  {
    icon: MapPinCheck,
    title: "GPS-verified guards and supervisors",
    text: "Our manager always has every guard's and supervisor's location on a live map, and is alerted the moment someone leaves your site.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance checked on site",
    text: "Guards can only sign in from your site, and every arrival and departure is time-stamped.",
  },
  {
    icon: BookLock,
    title: "Digital Occurrence Book",
    text: "Every handover, patrol and visitor is logged in a digital OB that can't be edited or deleted, and printed for you on request.",
  },
  {
    icon: Siren,
    title: "Digital incident reports",
    text: "Incidents are reported from the phone with photos and a reference number, and serious ones go straight to management.",
  },
];

const PhoneMockup = () => (
  <div className="mock" aria-hidden="true">
    <div className="mock__screen">
      <p className="mock__heading">Live tracker</p>
      <div className="mock__map">
        <span className="mock__site" />
        <span className="mock__pin mock__pin--on" style={{ left: "44%", top: "40%" }} />
        <span className="mock__pin mock__pin--on" style={{ left: "58%", top: "56%" }} />
        <span className="mock__pin mock__pin--near" style={{ left: "70%", top: "28%" }} />
      </div>
      <ul className="mock__list">
        <li><span className="dot dot--on" />Main gate · On location</li>
        <li><span className="dot dot--on" />Patrol · On location</li>
        <li><span className="dot dot--near" />Back wall · Near location</li>
      </ul>
      <div className="mock__ob">
        <p className="mock__ob-title">Occurrence Book · Today</p>
        <p>06:00 Shift handover. All in order.</p>
        <p>07:30 Patrol done. All in order.</p>
      </div>
    </div>
  </div>
);

const HowWeWork = () => (
  <section id="how-we-work" className="section section--dark" aria-labelledby="how-title">
    <div className="section__inner how">
      <div>
        <p className="section__eyebrow">How we keep your site protected</p>
        <h2 id="how-title" className="section__title">
          Guarding you can check, not just trust
        </h2>
        <p className="section__lead">
          We run our operations on our own management system. Paper
          registers and OB books are gone; every shift leaves a digital,
          time-stamped record.
        </p>
        <ul className="features">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="feature">
              <span className="feature__icon">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h3 className="feature__title">{title}</h3>
                <p className="feature__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <PhoneMockup />
    </div>
  </section>
);

export default HowWeWork;
