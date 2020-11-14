import { jest } from "@jest/globals";

import { scrapWorldQuests } from "../scrapWorldQuests.js";

test("urls creation", async () => {
  const scrap = jest.fn(() => Promise.resolve());

  await scrapWorldQuests(scrap);

  expect(scrap).toHaveBeenCalledTimes(4);

  expect(scrap).toHaveBeenNthCalledWith(1, "https://www.wowhead.com/world-quests/legion/eu");
  expect(scrap).toHaveBeenNthCalledWith(2, "https://www.wowhead.com/world-quests/bfa/eu");
  expect(scrap).toHaveBeenNthCalledWith(3, "https://www.wowhead.com/world-quests/legion/na");
  expect(scrap).toHaveBeenNthCalledWith(4, "https://www.wowhead.com/world-quests/bfa/na");
});

test("html mapper", async () => {
  const scrap = jest.fn((url) => Promise.resolve(url));

  const result = await scrapWorldQuests(scrap);

  expect(result).toMatchSnapshot()
})
