import { parseHtml } from "../parseHtml";
import { html } from "./input.mock";

test('parseHtml', () => {
  const result = parseHtml(html)
  
  expect(result).toMatchSnapshot()
})