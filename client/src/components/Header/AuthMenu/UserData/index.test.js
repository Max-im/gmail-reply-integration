import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../../../test/utils";
import { UserData } from "./";

describe("UserData", () => {
  window.confirm = jest.fn(() => true);
  const mockLogout = jest.fn();
  const props = {
    auth: { user: { picture: "picture", name: "name" } },
    onLogout: mockLogout
  };
  const userData = shallow(<UserData {...props} />);

  describe("Render", () => {
    test("component renders", () => isRender(userData, "userData"));
    test("img renders", () => isRender(userData, "userData__img"));
    test("logout icon renders", () => isRender(userData, "userData__icon"));
  });

  describe("should onLogout by click", () => {
    userData.find("[data-test='userData__icon']").simulate("click");
    expect(window.confirm).toBeCalled();
    expect(mockLogout).toHaveBeenCalled();
  });
});
