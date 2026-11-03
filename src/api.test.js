// Tests for the Vercel Functions in /api (run here because CRA's Jest only
// looks in src). They call each handler with a fake request and response.
const contact = require("../api/contact");
const health = require("../api/health");
const review = require("../api/review");
const reviews = require("../api/reviews");

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

describe("reviews and the BMS", () => {
  const goodReview = { rating: 5, name: "Jane Wanjiru", comment: "Always on time and polite.", email: "j@example.com" };
  const ok = (body = {}) => Promise.resolve({ ok: true, json: () => Promise.resolve(body), text: () => Promise.resolve("") });

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    process.env.BMS_API_URL = "https://bms.example.com/";
    process.env.BMS_API_TOKEN = "tok";
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("a review is saved in the BMS even without email set up", async () => {
    global.fetch = jest.fn(() => ok({ ok: true }));
    const res = fakeRes();
    await review(post(goodReview), res);
    expect(res.statusCode).toBe(200);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("https://bms.example.com/api/website/reviews/");
    expect(options.headers.Authorization).toBe("Bearer tok");
    expect(JSON.parse(options.body)).toEqual({ ...goodReview, location: "", email: "j@example.com" });
  });

  test("a review is still emailed when the BMS is down", async () => {
    process.env.RESEND_API_KEY = "re_test";
    global.fetch = jest.fn((url) =>
      url.startsWith("https://bms")
        ? Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve("boom") })
        : ok()
    );
    const res = fakeRes();
    await review(post(goodReview), res);
    expect(res.statusCode).toBe(200);
    expect(global.fetch).toHaveBeenCalledWith("https://api.resend.com/emails", expect.any(Object));
  });

  test("the visitor is told when neither the BMS nor email took the review", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve("") }));
    const res = fakeRes();
    await review(post(goodReview), res);
    expect(res.statusCode).toBe(502);
  });

  test("without the BMS or email the browser is told to fall back (503)", async () => {
    delete process.env.BMS_API_URL;
    const res = fakeRes();
    await review(post(goodReview), res);
    expect(res.statusCode).toBe(503);
  });

  test("GET /api/reviews returns the published reviews, cached", async () => {
    global.fetch = jest.fn(() =>
      ok({ reviews: [{ id: "bms-3", rating: 4, name: "Jane W.", location: "Kisumu", comment: "Great." }] })
    );
    const res = fakeRes();
    await reviews({ method: "GET" }, res);
    expect(global.fetch.mock.calls[0][0]).toBe("https://bms.example.com/api/website/reviews/published/");
    expect(res.body.reviews).toEqual([
      { id: "bms-3", rating: 4, name: "Jane W.", location: "Kisumu", comment: "Great.", status: "approved" },
    ]);
    expect(res.headers["Cache-Control"]).toMatch(/s-maxage=600/);
  });

  test("GET /api/reviews answers an empty list when the BMS is down or not set up", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("offline")));
    let res = fakeRes();
    await reviews({ method: "GET" }, res);
    expect(res.body).toEqual({ reviews: [] });
    delete process.env.BMS_API_URL;
    res = fakeRes();
    await reviews({ method: "GET" }, res);
    expect(res.body).toEqual({ reviews: [] });
  });
});
