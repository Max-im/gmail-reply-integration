import React from "react";
import { shallow } from "enzyme";
import { isRender } from "../../../test/utils";
import { Progress } from "./";

describe("Progress", () => {
  const progressVal = 81;
  const progressTitle = "test title of progress";
  const props = { integration: { progress: progressVal, progressTitle } };
  const progress = shallow(<Progress {...props} />);

  describe("Render propertly", () => {
    test("component", () => isRender(progress, "progress"));
    test("title", () => isRender(progress, "progress__title"));
    test("wrapper", () => isRender(progress, "progress__wrapper"));
    test("field", () => isRender(progress, "progress__field"));
  });

  describe("Correct values", () => {
    test("title", () => {
      expect(progress.find("[data-test='progress__title']").text()).toBe(
        progressTitle
      );
    });
    test("field", () => {
      expect(
        progress.find("[data-test='progress__field']").props().style.width
      ).toBe(`${progressVal}%`);
    });
  });
});
