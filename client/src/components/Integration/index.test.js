import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../test/utils";
import { Integration } from "./index";

describe("Integration", () => {
  const fileId = "idOfTheFile";
  const sheetName = "nameOfTheSheet";
  const mockLaunch = jest.fn();
  const initProps = {
    onLaunch: mockLaunch,
    display: { actions: [], showProgress: true },
    match: { params: { fileId, sheetName } }
  };

  /*
   * componentDidMount should start onLaunch function
   */
  describe("componentDidMount should start onLaunch function", () => {
    const integration = shallow(<Integration {...initProps} />);

    test("trigger componentDidMount", () => {
      expect(mockLaunch).toHaveBeenCalledTimes(0);
      integration.instance().componentDidMount();
      expect(mockLaunch).toHaveBeenCalledTimes(1);
      expect(mockLaunch).toHaveBeenCalledWith(fileId, sheetName);
    });
  });

  /*
   * Components Render with spinner and without actions
   */
  describe("Components Render with spinner and without actions", () => {
    const integration = shallow(<Integration {...initProps} />);

    test("component", () => isRender(integration, "integration"));
    test("title", () => isRender(integration, "integration__title"));
    test("subtitle", () => isRender(integration, "integration__subtitle"));
    test("fileLink", () => isRender(integration, "integration__fileLink"));
    test("actions list", () =>
      isRender(integration, "integration__actionsList"));
    test("actions length === 0", () => {
      expect(integration.find("[data-test='integration__action']").length).toBe(
        0
      );
    });
    test("spinner", () => isRender(integration, "integration__progress"));
  });

  /*
   * Components Render without spinner and with actions
   */
  describe("Components Render without spinner and with actions", () => {
    const actions = [
      { type: "info", text: "one - info" },
      { type: "error", text: "two - error" }
    ];
    const props = {
      ...initProps,
      display: { actions, showProgress: false }
    };
    const integration = shallow(<Integration {...props} />);

    test("component", () => isRender(integration, "integration"));
    test("title", () => isRender(integration, "integration__title"));
    test("subtitle", () => isRender(integration, "integration__subtitle"));
    test("fileLink", () => isRender(integration, "integration__fileLink"));
    test("actions list", () =>
      isRender(integration, "integration__actionsList"));
    test("spinner", () => isNotRender(integration, "integration__progress"));
    test("actions length === actions.lenght", () => {
      expect(integration.find("[data-test='integration__action']").length).toBe(
        actions.length
      );
    });
    test("actions inner length === actions.lenght", () => {
      expect(
        integration.find("[data-test='integration__actionInner']").length
      ).toBe(actions.length);
    });
    test("actions number length === actions.lenght", () => {
      expect(
        integration.find("[data-test='integration__actionNumber']").length
      ).toBe(actions.length);
    });
    test("actions text length === actions.lenght", () => {
      expect(
        integration.find("[data-test='integration__actionText']").length
      ).toBe(actions.length);
    });
    test("actions icon length === actions.lenght", () => {
      expect(integration.find("[data-test='integration__icon']").length).toBe(
        actions.length
      );
    });
    test("first action test", () => {
      expect(
        integration
          .find("[data-test='integration__actionNumber']")
          .at(0)
          .text()
      ).toBe("1");

      expect(
        integration
          .find("[data-test='integration__actionText']")
          .at(0)
          .text()
      ).toBe("one - info");

      expect(
        integration
          .find("[data-test='integration__action']")
          .at(0)
          .hasClass("actions__item_error")
      ).toBe(false);

      expect(
        integration
          .find("[data-test='integration__action']")
          .at(0)
          .hasClass("actions__item_error")
      ).toBe(false);

      expect(
        integration
          .find("[data-test='integration__icon']")
          .at(0)
          .hasClass("fa-check")
      ).toBe(true);
    });

    test("second action test", () => {
      expect(
        integration
          .find("[data-test='integration__actionNumber']")
          .at(1)
          .text()
      ).toBe("2");

      expect(
        integration
          .find("[data-test='integration__actionText']")
          .at(1)
          .text()
      ).toBe("two - error");

      expect(
        integration
          .find("[data-test='integration__action']")
          .at(1)
          .hasClass("actions__item_error")
      ).toBe(true);

      expect(
        integration
          .find("[data-test='integration__icon']")
          .at(1)
          .hasClass("fa-times")
      ).toBe(true);
    });
  });
});
