const urlTemplate = `https://www.wowhead.com/world-quests/{addon}/{region}`;

const addons = ["legion", "bfa"];
const regions = ["eu", "na"];

export async function scrapWorldQuests(scrapFn) {
  const htmlMap = {};

  for (const region of regions) {
    for (const addon of addons) {
      const url = urlTemplate
        .replace(/{addon}/, addon)
        .replace(/{region}/, region);

      const html = await scrapFn(url);

      htmlMap[`${region}-${addon}`] = html;
    }
  }

  return htmlMap;
}
