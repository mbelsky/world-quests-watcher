import { regions } from "./const.js";

export function mapQuestsByRegion(quests) {
  const map = regions.reduce((result, region) => {
    result[region] = {};
    return result;
  }, {});

  quests.forEach((quest) => {
    const { id, region } = quest;

    if (region in map) {
      map[region][id] = quest;
    } else {
      console.warn(`Unexpected region value`, quest);
    }
  });

  return map;
}
