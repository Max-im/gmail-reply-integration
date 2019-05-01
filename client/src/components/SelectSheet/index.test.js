import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../test/utils";
import { SheetsList } from "./";

describe("Sheet List", () => {
  const mockGetSheets = jest.fn();
  const sheetName = "noIdButName";
  const initProps = {
    getSheets: mockGetSheets,
    input: { sheets: [], sheetsReady: false, sheetError: null },
    match: { params: { sheetName } }
  };

  /*
   * Trigger function
   */
  describe("should launch getSheet function", () => {
    const props = { ...initProps };
    const sheetList = shallow(<SheetsList {...props} />);

    test("launched by componentDidMount", () => {
      expect(mockGetSheets).toHaveBeenCalledTimes(0);
      sheetList.instance().componentDidMount();
      expect(mockGetSheets).toHaveBeenCalledTimes(1);
      expect(mockGetSheets).toHaveBeenCalledWith(sheetName);
    });
  });

  /*
   * Render components [sheetsReady = false]
   */
  describe("Render components [sheetsReady = false]", () => {
    const props = { ...initProps };
    const sheetList = shallow(<SheetsList {...props} />);

    test("component", () => isRender(sheetList, "sheetList"));
    test("title", () => isRender(sheetList, "sheetList__title"));
    test("subtitle", () => isRender(sheetList, "sheetList__subtitle"));
    test("content", () => isNotRender(sheetList, "sheetList__content"));
    test("back btn", () => isNotRender(sheetList, "sheetList__back"));
    test("overlay", () => isRender(sheetList, "sheetList__overlay"));
    test("error", () => isNotRender(sheetList, "sheetList__error"));
  });

  /*
   * Render components [sheetsReady = true]
   */
  describe("Render components [sheetsReady = false]", () => {
    const props = { ...initProps };
    props.input.sheetsReady = true;
    const sheetList = shallow(<SheetsList {...props} />);

    test("component", () => isRender(sheetList, "sheetList"));
    test("title", () => isRender(sheetList, "sheetList__title"));
    test("subtitle", () => isRender(sheetList, "sheetList__subtitle"));
    test("overlay", () => isNotRender(sheetList, "sheetList__overlay"));
    test("back btn", () => isRender(sheetList, "sheetList__back"));
    test("content", () => isRender(sheetList, "sheetList__content"));
    test("error", () => isNotRender(sheetList, "sheetList__error"));
  });

  /*
   * Render sheets from props
   */
  describe("should render sheets from props", () => {
    const renderSheets = [
      { sheetId: 0, title: "sheet one" },
      { sheetId: 1, title: "sheet two" }
    ];
    const props = { ...initProps };
    props.input.sheets = renderSheets;
    const sheetList = shallow(<SheetsList {...props} />);

    test("should render all renderSheets items ", () => {
      expect(sheetList.find("[data-test='sheetList__item']").length).toBe(
        renderSheets.length
      );
      expect(sheetList.find("[data-test='sheetList__itemText']").length).toBe(
        renderSheets.length
      );
    });

    test("should match by text", () => {
      renderSheets.forEach((expectItem, i) => {
        expect(
          sheetList
            .find("[data-test='sheetList__itemText']")
            .at(i)
            .text()
        ).toBe(expectItem.title);
      });
    });
  });

  /*
   * Shold display error
   */
  describe("Shold display error", () => {
    const errorText = "Sheets error";
    const props = { ...initProps };
    props.input.sheetError = errorText;
    const sheetList = shallow(<SheetsList {...props} />);

    test("should render error component", () => {
      isRender(sheetList, "sheetList__error");
    });

    test("should match by error text", () => {
      expect(sheetList.find("[data-test='sheetList__error']").text()).toBe(
        errorText
      );
    });
  });
});
