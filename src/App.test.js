import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { REVIEWS } from "./reviewsData";

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
