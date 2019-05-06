import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../test/utils";
import Footer from "./";

describe("Footer", () => {
  const footer = shallow(<Footer />);

  describe("render", () => {
    test("component renders correctly", () => isRender(footer, "footer"));
    test("documentation link renders ", () => isRender(footer, "footer__doc"));
    test("copyright renders ", () => isRender(footer, "footer__copyright"));
  });

  describe("right text", () => {
    test("copyright", () => {
      const currentYear = new Date().getFullYear();
      const expectedText = `Copyright © ${currentYear}`;
      expect(footer.find("[data-test='footer__copyright']").text()).toBe(
        expectedText
      );
    });
  });
});
