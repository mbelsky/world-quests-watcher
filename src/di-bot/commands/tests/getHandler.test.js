import { getHandler } from "../getHandler.js";

test("getHandler", () => {
  const map = {
    region: () => {},
    "te5t-!@#$": () => {},
  };
  expect(getHandler("region eu", map)).toBe(undefined);
  expect(getHandler("!region eu", map)).toBe(map.region);
  expect(getHandler("!region na", map)).toBe(map.region);
  expect(getHandler("!te5t-!@#$", map)).toBe(map["te5t-!@#$"]);
  expect(getHandler("!undefined", map)).toBe(undefined);
});
