import { parseQuestId } from "../parseQuestId.js";

test("empty text", () => {
  expect(parseQuestId(``)).toEqual([]);
});

test("text without args", () => {
  expect(parseQuestId(`!sub`)).toEqual([]);
});

test("parse digits", () => {
  expect(parseQuestId(`!sub 12 1 2 3 5 8 42, , ,128, 1961 2020`)).toEqual([
    "12",
    "42",
    "128",
    "1961",
    "2020",
  ]);
});

test("parse urls", () => {
  const text = `
!sub https://www.wowhead.com/quest=45439, https://www.wowhead.com/quest=43445/air-superiority ,https://www.wowhead.com/quest=45072/barrels-o-fun
`.trim();

  expect(parseQuestId(text)).toEqual(["45439", "43445", "45072"]);
});

test("returns unique values", () => {
  expect(parseQuestId(`!sub 42, 42 42 ,42`)).toEqual(["42"]);
});
