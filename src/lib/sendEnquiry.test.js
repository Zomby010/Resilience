import emailjs from "@emailjs/browser";

import { sendEnquiry } from "./sendEnquiry";

jest.mock("@emailjs/browser", () => ({ send: jest.fn(() => Promise.resolve()) }));

const payload = { name: "Jane", phone: "0712345678", summary: "hello" };

beforeEach(() => {
  emailjs.send.mockClear();
  process.env.REACT_APP_SERVICE_ID = "svc";
  process.env.REACT_APP_TEMPLATE_ID = "tpl";
  process.env.REACT_APP_PUBLIC_KEY = "key";
});

test("uses the server function when it answers OK", async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200 }));
  await sendEnquiry("contact", payload);
  expect(global.fetch).toHaveBeenCalledWith("/api/contact", expect.any(Object));
  expect(emailjs.send).not.toHaveBeenCalled();
});

test("falls back to EmailJS while Resend is not set up (503)", async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 503 }));
  await sendEnquiry("contact", payload);
  expect(emailjs.send).toHaveBeenCalledWith(
    "svc",
    "tpl",
    expect.objectContaining({ user_name: "Jane", message: "hello" }),
    { publicKey: "key" }
  );
});

test("shows the server's message on a validation error", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, status: 400, json: () => Promise.resolve({ error: "Enter your name." }) })
  );
  await expect(sendEnquiry("contact", payload)).rejects.toThrow("Enter your name.");
  expect(emailjs.send).not.toHaveBeenCalled();
});
