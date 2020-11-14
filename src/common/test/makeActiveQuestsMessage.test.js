import { makeActiveQuestsMessage } from "../makeActiveQuestsMessage.js";

const quests = [
  {
    endsAt: "10 hours",
    href: "/quest=40337",
    id: "40337",
    name: "Flummoxed",
    region: "na",
  },
  {
    endsAt: "11 hours",
    href: "/quest=40850",
    id: "40850",
    name: "Prisoners of Greystone",
    region: "na",
  },
];

test("makeActiveQuestsMessage", () => {
  expect(makeActiveQuestsMessage(quests)).toMatchSnapshot();
});
