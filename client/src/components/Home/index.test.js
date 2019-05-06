import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../test/utils";
import HomePage from "./";

describe("Home Page", () => {
  const home = shallow(<HomePage />);
  test("home renders propertly", () => isRender(home, "home"));
  test("background renders propertly", () => isRender(home, "home__bg"));
  test("titile renders propertly", () => isRender(home, "home__title"));
  test("subtitle renders propertly", () => isRender(home, "home__subtitle"));
});
