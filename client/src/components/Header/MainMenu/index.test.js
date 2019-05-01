import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../../test/utils";
import { MainMenu } from "./";

describe("MainMenu", () => {
  /*
   * Render components when user DOES Auth
   */
  describe("Render components when user DOES Auth", () => {
    const props = { auth: { isAuth: true } };
    const mainMenu = shallow(<MainMenu {...props} />);

    test("mainMenu", () => isRender(mainMenu, "mainMenu"));
    test("home", () => isRender(mainMenu, "mainMenu__home"));
    test("settings", () => isRender(mainMenu, "mainMenu__settings"));
    test("integration", () => isRender(mainMenu, "mainMenu__integration"));
  });

  /*
   * Render components when user DOES NOT Auth
   */
  describe("Render components when user DOES NOT Auth", () => {
    const props = { auth: { isAuth: false } };
    const mainMenu = shallow(<MainMenu {...props} />);

    test("mainMenu", () => isRender(mainMenu, "mainMenu"));
    test("home", () => isRender(mainMenu, "mainMenu__home"));
    test("settings", () => isNotRender(mainMenu, "mainMenu__settings"));
    test("integration", () => isNotRender(mainMenu, "mainMenu__integration"));
  });
});
