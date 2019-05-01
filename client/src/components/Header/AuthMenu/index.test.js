import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender, searchEl } from "../../../../test/utils";
import { AuthMenu } from "./";

describe("AuthMenu", () => {
  /*
   * NO error, USER Logged in
   */
  describe("NO error, USER Logged in", () => {
    const props = { auth: { isAuth: true, error: null } };
    const authMenu = shallow(<AuthMenu {...props} />);

    test("Component renders", () => isRender(authMenu, "authMenu"));
    test("userData renders", () => isRender(authMenu, "authMenu__userData"));
    test("Login not renders", () => isNotRender(authMenu, "authMenu__login"));
    test("error not renders", () => isNotRender(authMenu, "authMenu__error"));
  });

  /*
   * NO error, USER NOT Logged in
   */
  describe("NO error, USER NOT Logged in", () => {
    const props = { auth: { isAuth: false, error: null } };
    const authMenu = shallow(<AuthMenu {...props} />);

    test("Component renders", () => isRender(authMenu, "authMenu"));
    test("userData hidden", () => isNotRender(authMenu, "authMenu__userData"));
    test("Login renders", () => isRender(authMenu, "authMenu__login"));
    test("error not renders", () => isNotRender(authMenu, "authMenu__error"));
  });

  /*
   * error, USER Logged in
   */
  describe("NO error, USER Logged in", () => {
    const error = "Login error text";
    const props = { auth: { isAuth: true, error } };
    const authMenu = shallow(<AuthMenu {...props} />);

    test("Component renders", () => isRender(authMenu, "authMenu"));
    test("userData renders", () => isRender(authMenu, "authMenu__userData"));
    test("Login not renders", () => isNotRender(authMenu, "authMenu__login"));
    test("error renders", () => isRender(authMenu, "authMenu__error"));
    test("error text", () => {
      expect(searchEl(authMenu, "authMenu__error").text()).toBe(error);
    });
  });

  /*
   * error, USER NOT Logged in
   */
  describe("NO error, USER NOT Logged in", () => {
    const error = "Login error text";
    const props = { auth: { isAuth: false, error } };
    const authMenu = shallow(<AuthMenu {...props} />);

    test("Component renders", () => isRender(authMenu, "authMenu"));
    test("userData hidden", () => isNotRender(authMenu, "authMenu__userData"));
    test("Login renders", () => isRender(authMenu, "authMenu__login"));
    test("error renders", () => isRender(authMenu, "authMenu__error"));
    test("error text", () => {
      expect(searchEl(authMenu, "authMenu__error").text()).toBe(error);
    });
  });
});
