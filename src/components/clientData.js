/**
 * clientData.js
 * -----------------------------------------------------------------------
 * Single source of truth for the client registry. client.jsx renders it,
 * and about.jsx / home.jsx read the derived TOTAL_* figures so the site
 * statistics can never drift from the list.
 *
 * `location` is optional: assignments with no confirmed location are
 * listed without one (and grouped under "Other Assignments") rather than
 * having a location invented for them.
 * -----------------------------------------------------------------------
 */
export const CLIENT_REGISTRY = [
  {
    region: "Kisumu & Surrounds",
    clients: [
      { name: "KESS Suppliers", location: "Kisumu" },
      { name: "La Breeze Hotel", location: "Kisumu" },
      { name: "SawaSawa Bar & Restaurant", location: "Kisumu" },
      { name: "Uyoma Naya", location: "Kisumu" },
      { name: "La Petite", location: "Kisumu" },
      { name: "Bridge Apartment", location: "Kisumu" },
      { name: "Kika Hotel", location: "Kisumu" },
      { name: "Tripple Flat", location: "Kisumu" },
      { name: "Staycation", location: "Kisumu" },
      { name: "Faustine", location: "Kisumu" },
      { name: "Robberts Inn", location: "Kisumu" },
      { name: "Betty Residence", location: "Kisumu" },
      { name: "Malaika Apartment", location: "Kisumu" },
      { name: "Berly Apartment", location: "Kisumu" },
    ],
  },
  {
    region: "Sondu / Ahero / Chabera",
    clients: [
      { name: "Maraboi Estate", location: "Sondu" },
      { name: "Asila Miller's", location: "Ahero" },
      { name: "Pearl Water Ltd", location: "Ahero" },
      { name: "Pambo Bar and Restaurant", location: "Chabera" },
    ],
  },
  {
    region: "Nyakach",
    clients: [
      { name: "Sigoti Girls", location: "Nyakach" },
      { name: "Pawtenge Secondary", location: "Nyakach" },
    ],
  },
  {
    region: "Nyamira / Ogembo",
    clients: [
      { name: "Stecol Corporation", location: "Nyamira" },
      { name: "Stecol Corporation", location: "Ogembo" },
    ],
  },
  {
    region: "Siaya / Usenge / Ugunja",
    clients: [
      { name: "Alicia Bakery & Confectionous", location: "Usenge" },
      { name: "Azuri Hotel", location: "Ugunja" },
      { name: "Sino Hydro", location: "Siaya" },
    ],
  },
  {
    region: "Butere",
    clients: [
      { name: "A.C.K Church", location: "Butere" },
      { name: "Butere Girls", location: "Butere" },
      { name: "Butere Boys", location: "Butere" },
      { name: "Mabole Boys", location: "Butere" },
      { name: "Manyalla Boys", location: "Butere" },
      { name: "St. Luke Cathedral", location: "Butere" },
    ],
  },
  {
    region: "Vihiga",
    clients: [
      {
        name: "Chanzeywe Technical & Vocational College",
        location: "Vihiga",
      },
    ],
  },
  {
    region: "Kwale",
    clients: [{ name: "Stecol Kwale", location: "Kwale" }],
  },
  {
    region: "Other Assignments",
    clients: [
      { name: "Rongo Assignment" },
      { name: "Kitale Assignment" },
      { name: "Ober Level 4 Hospital" },
    ],
  },
];

export const TOTAL_CLIENTS = CLIENT_REGISTRY.reduce(
  (sum, region) => sum + region.clients.length,
  0
);

// Distinct towns that have a confirmed location.
export const TOTAL_TOWNS = new Set(
  CLIENT_REGISTRY.flatMap((region) =>
    region.clients.map((client) => client.location).filter(Boolean)
  )
).size;
