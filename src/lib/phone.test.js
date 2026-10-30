import { normaliseKenyanPhone } from "./phone";

// The server keeps its own copy (Vercel functions can't import from src).
const server = require("../../api/_lib/phone");

const VALID = [
  ["0712345678", "+254712345678"],
  ["0712 345 678", "+254712345678"],
  ["0712-345-678", "+254712345678"],
  ["0110 123 456", "+254110123456"],
  ["+254 712 345 678", "+254712345678"],
  ["254712345678", "+254712345678"],
  ["+254-110-123456", "+254110123456"],
  ["(0712) 345.678", "+254712345678"],
  ["712345678", "+254712345678"],
];

const INVALID = ["", "12345", "0612345678", "0571234567", "+1 202 555 0143", "07123456789", "0712abc678", "+44 7911 123456"];

test.each(VALID)("accepts %s", (input, expected) => {
  expect(normaliseKenyanPhone(input)).toBe(expected);
  expect(server.normaliseKenyanPhone(input)).toBe(expected);
});

test.each(INVALID)("rejects %s", (input) => {
  expect(normaliseKenyanPhone(input)).toBe("");
  expect(server.normaliseKenyanPhone(input)).toBe("");
});
