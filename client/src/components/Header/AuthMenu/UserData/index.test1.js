import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../../../test/utils";
import { UserData } from "./";

describe("UserData", () => {
  const props = { auth: { user: { picture: "picture", name: "name" } } };
  const userData = shallow(<UserData {...props} />);
});
