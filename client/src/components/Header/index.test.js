import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../test/utils";
import Header from "./";

describe("Header", () => {
  const header = shallow(<Header />);

  describe("render", () => {
    test("component renders correctly", () => isRender(header, "header"));
    test("mainMenu renders", () => isRender(header, "header__mainMenu"));
    test("authMenu renders ", () => isRender(header, "header__authMenu"));
  });
});
