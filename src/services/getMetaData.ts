import { requestHtml } from "./requestHTML";
import $ from "cheerio";

type HeroPosition =
  | "all"
  | "carry"
  | "mid"
  | "offlane"
  | "support-4"
  | "support-5";

type HeroMetaStats = {
  heroName: string;
  heroImage: string;
  heroAllWinRate: string;
  heroRadiantWinRate: string;
  heroDireWinRate: string;
};
type metaMap = {
  [key: number]: "overall" | "radiant" | "dire";
};

const heroPosEnum = {
  all: "tabs-1",
  carry: "tabs-2",
  mid: "tabs-3",
  offlane: "tabs-4",
  "support-4": "tabs-5",
  "support-5": "tabs-6",
};

type PositionMeta = {
  overall: HeroMetaStats[];
  radiant: HeroMetaStats[];
  dire: HeroMetaStats[];
};

const orderMetaData = (posMeta:PositionMeta):PositionMeta => {
  const { overall, radiant, dire } = posMeta;
  const orderedOverall = overall.sort((a, b) => {
    const aWinRate = parseFloat(a.heroAllWinRate);
    const bWinRate = parseFloat(b.heroAllWinRate);
    return bWinRate - aWinRate;
  });
  const orderedRadiant = radiant.sort((a, b) => {
    const aWinRate = parseFloat(a.heroRadiantWinRate);
    const bWinRate = parseFloat(b.heroRadiantWinRate);
    return bWinRate - aWinRate;
  });
  const orderedDire = dire.sort((a, b) => {
    const aWinRate = parseFloat(a.heroDireWinRate);
    const bWinRate = parseFloat(b.heroDireWinRate);
    return bWinRate - aWinRate;
  });
  return {
    overall: orderedOverall,
    radiant: orderedRadiant,
    dire: orderedDire,
  };
};

export const getMetaData = async (position: HeroPosition) => {
  const heroPosition = heroPosEnum[position];
  const html = await requestHtml("https://www.dota2protracker.com/meta");

  let counter = 0;

  let posMeta: PositionMeta = {
    overall: [] as HeroMetaStats[],
    radiant: [] as HeroMetaStats[],
    dire: [] as HeroMetaStats[],
  };

  const teamMetaMap: metaMap = {
    0: "overall",
    1: "radiant",
    2: "dire",
  };
  $(`.${heroPosition}`, html).each(function () {
    if (counter > 2) return false;
    const elements = $(this).find(".top-heroes .top-hero");
    if (elements.find("a").attr("href")!.includes("player")) return;

    elements.each(function () {
      const childrenElements = $(this);
      const heroName = childrenElements.find("a").attr("title") || "";
      const heroImage = childrenElements.find("img").attr("src") || "";
      const heroAllWinRate = childrenElements
        .find(".all-wr")
        .text()
        .replace("\n", "")
        .trim();
      const heroRadiantWinRate = childrenElements
        .find(".radiant-wr")
        .text()
        .replace("\n", "")
        .trim();
      const heroDireWinRate = childrenElements
        .find(".dire-wr")
        .text()
        .replace("\n", "")
        .trim();
      const heroStats: HeroMetaStats = {
        heroName,
        heroImage,
        heroAllWinRate,
        heroRadiantWinRate,
        heroDireWinRate,
      };
      posMeta[teamMetaMap[counter]].push(heroStats);
    });
    console.log(orderMetaData(posMeta));

    counter++;
  });
};
