import { mapQuestsByRegion } from "../mapQuests.js";

const quests = [
  {
    endsAt: "11 hours",
    href: "/quest=52986",
    id: "52986",
    region: "na",
  },
  {
    endsAt: "11 hours",
    href: "/quest=52989",
    id: "52989",
    region: "na",
  },
  {
    endsAt: "11 hours",
    href: "/quest=52981",
    id: "52981",
    region: "na",
  },
  {
    endsAt: "11 hours",
    href: "/quest=62989",
    id: "62989",
    region: "na",
  },
  {
    endsAt: "11 hours",
    href: "/quest=62989",
    id: "62989",
    region: "eu",
  },
  {
    endsAt: "11 hours",
    href: "/quest=62981",
    id: "62981",
    region: "eu",
  },
  {
    endsAt: "11 hours",
    href: "/quest=52989",
    id: "52989",
    region: "eu",
  },
];

test("mapQuestsByRegion", () => {
  expect(mapQuestsByRegion(quests)).toMatchSnapshot();
});

test("with unexpected region", () => {
  expect(
    mapQuestsByRegion([
      {
        id: "52986",
        region: "kr",
      },
    ])
  ).toEqual({ eu: {}, na: {} });
});
