import moxios from "moxios";
import { ADD_INFO } from "../constants";
import { output, outputData, formateIntegrationData } from "./output";
import { getMockStore } from "../../../../test/utils";

const initProps = {
  connect: {
    compared: [
      [{ body: ["body1"], labels: ["1", "2", "3"], people: ["person1"] }]
    ]
  }
};
const store = getMockStore(initProps);

describe("utils/output", () => {
  beforeEach(() => moxios.install());
  afterEach(() => {
    moxios.uninstall();
    store.clearActions();
  });

  /**
   * formateIntegrationData
   */
  test("formateIntegrationData", () => {
    const inputData = [
      [
        {
          labels: ["label1-1", "label1-2", "label1-1", "label1-3"],
          body: ["body1-1"]
        },
        {
          labels: ["label1-1", "label1-2", "label1-4", "label1-3"],
          body: ["body1-2"]
        }
      ],
      [
        {
          labels: ["label2-1", "label2-2"],
          body: ["body2-1"]
        }
      ]
    ];
    const expected = [
      ["Body", "Label-1", "Label-2", "Label-3", "Label-4"],
      [
        "body1-1\n===============\nbody1-2",
        "label1-1",
        "label1-2",
        "label1-3",
        "label1-4"
      ],
      ["body2-1", "label2-1", "label2-2", "", ""]
    ];

    expect(formateIntegrationData(inputData)).toEqual(expected);
  });

  /**
   * output [success]
   */
  test("output [success]", () => {
    const expectedActions = [
      { type: ADD_INFO, payload: "Output data" },
      { type: ADD_INFO, payload: "Success" }
    ];
    moxios.stubRequest("/output/sheet", { status: 200, response: "woohoo" });

    return store
      .dispatch(output("fileId", "sheetName", store.getState))
      .then(() => {
        expect(expectedActions).toEqual(store.getActions());
      });
  });

  /**
   * outputData [success]
   */
  test("outputData [success]", () => {
    const expected = "some text";
    moxios.stubRequest("/output/sheet", { status: 200, response: expected });

    return outputData([1, 2, 3], "fileId", "sheetName").then(data => {
      expect(expected).toBe(data);
    });
  });

  /**
   * outputData [error]
   */
  test("outputData [error]", () => {
    const expected = "error test";
    moxios.stubRequest("/output/sheet", { status: 400, response: expected });

    return outputData([1, 2, 3], "fileId", "sheetName").catch(data => {
      expect(expected).toBe(data);
    });
  });
});
