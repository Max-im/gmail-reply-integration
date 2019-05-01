import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../../test/utils";
import { LabelsContorl } from "./";

/*
 * labels control
 */
describe("labels control", () => {
  const mockGetLabels = jest.fn();
  const mockToggleLabel = jest.fn();
  const lablesList = [
    { ckecked: true, _id: 1, name: "firstLabel" },
    { ckecked: false, _id: 2, name: "secondLabel" },
    { ckecked: true, _id: 0, name: "zirroLabel" }
  ];
  const initProps = {
    getLabels: mockGetLabels,
    toggleCheck: mockToggleLabel,
    labels: { labels: lablesList, inProcess: true, error: null }
  };

  /*
   * launch getting labels
   */
  describe("launch getting labels", () => {
    const labels = shallow(<LabelsContorl {...initProps} />);

    test("launch by componentDidMount", () => {
      expect(mockGetLabels).toHaveBeenCalledTimes(0);
      labels.instance().componentDidMount();
      expect(mockGetLabels).toHaveBeenCalledTimes(1);
    });
  });

  /*
   * toggle label
   */
  describe("toggle label", () => {
    const labels = shallow(<LabelsContorl {...initProps} />);

    test("can toggle each label", () => {
      expect(mockToggleLabel).toHaveBeenCalledTimes(0);
      labels.find("[data-test='labels__item']").forEach((label, i) => {
        label.simulate("click");
        expect(mockToggleLabel).toHaveBeenCalledTimes(i + 1);
        expect(mockToggleLabel).toHaveBeenCalledWith(lablesList[i]._id);
      });
    });
  });

  /*
   * render propertly [inProcess]
   */
  describe("render propertly [inProcess]", () => {
    const labels = shallow(<LabelsContorl {...initProps} />);

    test("component", () => isRender(labels, "labels"));
    test("subtitle", () => isRender(labels, "labels__subtitle"));
    test("list", () => isNotRender(labels, "labels__list"));
    test("error", () => isNotRender(labels, "labels__error"));
  });

  /*
   * render propertly [!inProcess]
   */
  describe("render propertly [!inProcess]", () => {
    const props = { ...initProps };
    props.labels.inProcess = false;
    const labels = shallow(<LabelsContorl {...props} />);

    test("component", () => isRender(labels, "labels"));
    test("subtitle", () => isRender(labels, "labels__subtitle"));
    test("error", () => isNotRender(labels, "labels__error"));
    test("list", () => isRender(labels, "labels__list"));
    test("items", () => isRender(labels, "labels__item"));
    test("items amount", () => {
      expect(labels.find("[data-test='labels__item']").length).toBe(
        lablesList.length
      );
    });
    test("item name", () => {
      labels.find("[data-test='labels__name']").forEach((name, i) => {
        expect(name.text()).toBe(lablesList[i].name);
      });
    });
  });

  /*
   * render propertly [with error]
   */
  describe("render propertly [with error]", () => {
    const expectedError = "expectedError";
    const props = { ...initProps };
    props.labels.error = expectedError;
    const labels = shallow(<LabelsContorl {...props} />);

    test("component", () => isRender(labels, "labels"));
    test("error", () => isRender(labels, "labels__error"));
    test("error text", () => {
      expect(labels.find("[data-test='labels__error']").text()).toBe(
        expectedError
      );
    });
  });
});
