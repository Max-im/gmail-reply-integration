import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../../../test/utils";
import { Login } from "./";

describe("Login", () => {
  const mockLogin = jest.fn();
  const props = { onLogin: mockLogin };
  const login = shallow(<Login {...props} />);

  test("render propertly", () => isRender(login, "login"));

  // TODO find a way to test auth
});
