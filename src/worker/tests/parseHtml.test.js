import { parseHtml, parseHtmlMap } from "../parseHtml.js";
import { html, htmlMap } from "./input.mock.js";

test("parseHtml", () => {
  const result = parseHtml(html);

  expect(result).toMatchSnapshot();
});

test("parseHtmlMap", () => {
  const result = parseHtmlMap(htmlMap);

  expect(result.eu.length).toBe(8)
  expect(result.na.length).toBe(8)
  expect(result).toMatchSnapshot();
});
