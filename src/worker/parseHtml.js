import cheerio from "cheerio";

const s = {
  questsCount:
    ".listview-band-top > .listview-nav.listview-nav-nocontrols > span > b",
  row: ".listview-row",
  rowData: "td",
};

export function parseHtml(html) {
  const $ = cheerio.load(html);
  const questsCountNodes = $(s.questsCount);
  const nodeCounts = questsCountNodes.length;

  if (nodeCounts !== 3) {
    return {
      error: new Error(
        `Invalid questsCountNodes.length=${nodeCounts}. html: ${html}`
      ),
    };
  }

  const totalQuestsCount = questsCountNodes.last().text();

  const rowNodes = $(s.row);
  const rowNodesCount = rowNodes.length;
  const numberTotalQuestsCount = Number(totalQuestsCount);

  if (rowNodesCount !== numberTotalQuestsCount) {
    return {
      error: new Error(
        `rowNodesCount=${rowNodesCount} !== totalQuestsCount=${numberTotalQuestsCount}. html: ${html}`
      ),
    };
  }

  function mapRowNodes(_, rowNode) {
    rowNode = $(rowNode);

    const dataList = $(s.rowData, rowNode);

    if (dataList.length !== 5) {
      throw new Error(`Invalid dataList.length=${dataList.length}`);
    }

    const questAnchor = dataList.eq(0).find("a");
    const href = questAnchor.attr("href");
    const name = questAnchor.text().replace(/\s+/g, " ");
    const endsAt = dataList.eq(3).find("div").text().trim();
    const [__, id] = href.split("=");

    return { endsAt, href, id, name };
  }

  try {
    const quests = rowNodes.map(mapRowNodes).get();

    return {
      data: quests,
    };
  } catch (e) {
    return {
      error: new Error(e.message + ". html: " + html),
    };
  }
}

export function parseHtmlMap(htmlMap) {
  const questsMap = {};

  Object.entries(htmlMap).forEach(([key, html]) => {
    const [region] = key.split("-");

    const { data, error } = parseHtml(html);

    if (error) {
      // 😭
      throw error;
    }

    const quests = data.map((quest) => {
      return {
        ...quest,
        region,
      };
    });

    if (region in questsMap) {
      questsMap[region].push(...quests);
    } else {
      questsMap[region] = quests;
    }
  });

  return questsMap;
}
