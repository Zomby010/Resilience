// Tests for the Vercel Functions in /api (run here because CRA's Jest only
// looks in src). They call each handler with a fake request and response.
const contact = require("../api/contact");
const health = require("../api/health");

const fakeRes = () => {
  const res = { headers: {} };
  res.status = jest.fn((code) => Object.assign(res, { statusCode: code }));
  res.json = jest.fn((body) => Object.assign(res, { body }));
  res.setHeader = (k, v) => (res.headers[k] = v);
  return res;
};

let ip = 0;
const post = (body) => ({
  method: "POST",
  body,
  headers: { "x-forwarded-for": `10.0.0.${++ip}` },
});

const ENV = { ...process.env };
afterEach(() => {
  process.env = { ...ENV };
  jest.restoreAllMocks();
});

test("without RESEND_API_KEY the quote is refused with 503 and logged", async () => {
  delete process.env.RESEND_API_KEY;
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const res = fakeRes();
  await contact(post({ name: "Jane", phone: "0712345678" }), res);
  expect(res.statusCode).toBe(503);
  expect(res.body).toEqual({ error: "not_configured" });
  expect(log).toHaveBeenCalledWith(expect.stringMatching(/RESEND_API_KEY missing: quote not emailed/));
});

describe("with Resend configured", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve("") }));
  });

  test("rejects a non-Kenyan phone number", async () => {
    const res = fakeRes();
    await contact(post({ name: "Jane", phone: "+1 202 555 0143" }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Kenyan mobile number/);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("emails the office with the phone in +254 form", async () => {
    const res = fakeRes();
    await contact(post({ name: "Jane", phone: "0712 345 678", email: "jane@example.com" }), res);
    expect(res.statusCode).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1); // no confirmation unless SEND_CONFIRMATION
    const sent = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(sent.text).toContain("Phone: +254712345678");
    expect(sent.reply_to).toBe("jane@example.com");
  });

  test("sends the visitor a confirmation when SEND_CONFIRMATION is on", async () => {
    process.env.SEND_CONFIRMATION = "true";
    const res = fakeRes();
    await contact(post({ name: "Jane", phone: "0712345678", email: "jane@example.com" }), res);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const confirmation = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(confirmation.to).toEqual(["jane@example.com"]);
    expect(confirmation.text).toContain("+254712345678");
  });

  test("drops honeypot submissions without sending", async () => {
    const res = fakeRes();
    await contact(post({ name: "Bot", phone: "0712345678", website: "spam.example" }), res);
    expect(res.statusCode).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

test("health reports setup as booleans only", () => {
  process.env.RESEND_API_KEY = "re_secret";
  delete process.env.BMS_API_URL;
  const res = fakeRes();
  health({ method: "GET" }, res);
  expect(res.body.resend).toBe(true);
  expect(res.body.bms).toBe(false);
  expect(JSON.stringify(res.body)).not.toContain("re_secret");
});
