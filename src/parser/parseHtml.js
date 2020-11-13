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

    const href = dataList.find("a").attr("href");
    const endsAt = dataList.eq(3).find("div").text().trim();
    const id = href.split('=')[1]

    return { endsAt, href, id };
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
