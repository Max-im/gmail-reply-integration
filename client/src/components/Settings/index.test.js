import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../test/utils";
import { Settings } from "./";

describe("Settings", () => {
  const InitProps = {
    labels: { inProcess: false },
    accounts: { inProcess: false }
  };

  /*
   * should show components
   */
  describe("should show components", () => {
    const props = { ...InitProps };
    const settings = shallow(<Settings {...props} />);

    test("component", () => isRender(settings, "settings"));
    test("title", () => isRender(settings, "settings__title"));
    test("accounts", () => isRender(settings, "settings__accounts"));
    test("labels", () => isRender(settings, "settings__labels"));
    test("overlay", () => isNotRender(settings, "settings__overlay"));
  });

  /*
   * show overlay
   */
  describe("should show overlay", () => {
    /*
     * both process are busy
     */
    describe("both process are busy", () => {
      const props = { ...InitProps };
      props.accounts.inProcess = true;
      props.labels.inProcess = true;
      const settings = shallow(<Settings {...props} />);

      test("component", () => isRender(settings, "settings"));
      test("title", () => isRender(settings, "settings__title"));
      test("accounts", () => isRender(settings, "settings__accounts"));
      test("labels", () => isRender(settings, "settings__labels"));
      test("overlay", () => isRender(settings, "settings__overlay"));
    });

    /*
     * accounts only is busy
     */
    describe("accounts only is busy", () => {
      const props = { ...InitProps };
      props.accounts.inProcess = true;
      const settings = shallow(<Settings {...props} />);

      test("component", () => isRender(settings, "settings"));
      test("title", () => isRender(settings, "settings__title"));
      test("accounts", () => isRender(settings, "settings__accounts"));
      test("labels", () => isRender(settings, "settings__labels"));
      test("overlay", () => isRender(settings, "settings__overlay"));
    });

    /*
     * labels only is busy
     */
    describe("labels only is busy", () => {
      const props = { ...InitProps };
      props.labels.inProcess = true;
      const settings = shallow(<Settings {...props} />);

      test("component", () => isRender(settings, "settings"));
      test("title", () => isRender(settings, "settings__title"));
      test("accounts", () => isRender(settings, "settings__accounts"));
      test("labels", () => isRender(settings, "settings__labels"));
      test("overlay", () => isRender(settings, "settings__overlay"));
    });
  });
});
