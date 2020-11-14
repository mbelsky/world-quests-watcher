import { questsMapToList } from "../questsMapToList.js";

test("map convertation to list", () => {
  const map = {
    eu: [
      {
        endsAt: "11 hours 54 minutes",
        href: "/quest=52986",
        id: "52986",
        region: "eu",
      },
      {
        endsAt: "11 hours 54 minutes",
        href: "/quest=52988",
        id: "52988",
        region: "eu",
      },
    ],
    na: [
      {
        endsAt: "11 hours 54 minutes",
        href: "/quest=52986",
        id: "52986",
        region: "na",
      },
      {
        endsAt: "11 hours 54 minutes",
        href: "/quest=52989",
        id: "52989",
        region: "na",
      },
    ],
  };

  expect(questsMapToList(map)).toMatchSnapshot();
});
