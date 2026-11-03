import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { REVIEWS } from "./reviewsData";
import { resetReviewsCache } from "./lib/reviews";

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

test("has exactly one main heading with the core promise", () => {
  render(<App />);
  const headings = screen.getAllByRole("heading", { level: 1 });
  expect(headings).toHaveLength(1);
  expect(headings[0]).toHaveTextContent(/trained guards/i);
});

test("shows the company logo in the header", () => {
  render(<App />);
  const brand = screen.getByRole("link", { name: /spears resilience systems, back to top/i });
  expect(brand.querySelector("img")).toHaveAttribute(
    "src",
    "/images/logo-header.webp"
  );
});

test("a service's Get a quote pre-selects that service in the form", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("link", { name: /get a quote for cctv surveillance/i }));
  expect(screen.getByLabelText(/service you need/i)).toHaveValue("CCTV Surveillance");
});

test("the quote form asks for a name and phone before sending", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: /request my free assessment/i }));
  expect(screen.getByText("Enter your name.")).toBeInTheDocument();
  expect(screen.getByText("Enter a phone number we can call.")).toBeInTheDocument();
});

test("there is a single contact form", () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll("#contact form")).toHaveLength(1);
});

test("no placeholder reviews are published", () => {
  expect(REVIEWS.filter((r) => r.status === "approved")).toHaveLength(0);
});

test("if sending fails, offers WhatsApp with the request already filled in", async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 503 }));
  delete process.env.REACT_APP_SERVICE_ID; // no EmailJS fallback either
  render(<App />);
  await userEvent.type(screen.getByLabelText(/phone number/i), "0712 345 678");
  await userEvent.type(screen.getByLabelText(/your name/i), "Jane W.");
  await userEvent.selectOptions(screen.getByLabelText(/service you need/i), "CCTV Surveillance");
  await userEvent.type(screen.getByLabelText(/site location/i), "Kisumu");
  await userEvent.click(screen.getByRole("button", { name: /request my free assessment/i }));

  const link = await screen.findByRole("link", { name: /send this on whatsapp instead/i });
  const text = decodeURIComponent(link.getAttribute("href").split("text=")[1]);
  expect(text).toContain("Service: CCTV Surveillance");
  expect(text).toContain("Name: Jane W.");
  expect(text).toContain("Phone: 0712 345 678");
  expect(text).toContain("Site location: Kisumu");
});

test("a non-Kenyan phone number is flagged when leaving the field", async () => {
  render(<App />);
  const phone = screen.getByLabelText(/phone number/i);
  await userEvent.type(phone, "+44 7911 123456");
  await userEvent.tab();
  expect(phone).toHaveAttribute("aria-invalid", "true");
  expect(phone).toHaveAccessibleDescription(/kenyan mobile number/i);
});

test("Get a quote moves focus into the form", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("link", { name: /get a quote for cctv surveillance/i }));
  await new Promise((r) => setTimeout(r, 0));
  expect(screen.getByLabelText(/phone number/i)).toHaveFocus();
});

test("shows reviews the office published in the BMS", async () => {
  resetReviewsCache();
  global.fetch = jest.fn((url) =>
    url === "/api/reviews"
      ? Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              reviews: [{ id: "bms-1", rating: 5, name: "Jane W.", location: "Kisumu", comment: "Always on time.", status: "approved" }],
            }),
        })
      : Promise.resolve({ ok: false, status: 404 })
  );
  render(<App />);
  expect(await screen.findAllByText(/always on time/i)).not.toHaveLength(0);
  resetReviewsCache();
});
