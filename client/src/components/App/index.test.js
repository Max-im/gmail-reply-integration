import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../test/utils";
import App from "./";

const app = shallow(<App />);

describe("App", () => {
  test("component renders correctly", () => isRender(app, "app"));
  test("header renders correctly", () => isRender(app, "app__header"));
  test("main renders correctly", () => isRender(app, "app__main"));
  test("footer renders correctly", () => isRender(app, "app__footer"));
});
