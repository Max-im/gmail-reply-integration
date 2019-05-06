import {
  CONNECT_SHEET_DATA,
  CONNECT_GET_LABELS,
  CONNECT_GET_GMAIL_THREADS,
  CONNECT_GET_DB_THREADS,
  CONNECT_NEED_TO_CREATE,
  CONNECT_NEED_TO_UPDATE,
  CONNECT_NEED_TO_DELETE,
  CONNECT_GET_LABEL_MAP,
  CONNECT_GET_COMPRED,
  CONNECT_UPDATE
} from "../actions/constants";

import { connectState } from "./connectReducer";
import connect from "./connectReducer";

describe("Connect reducer", () => {
  /**
   * @CONNECT_SHEET_DATA
   */
  test("CONNECT_SHEET_DATA", () => {
    const sheetData = ["from sheet1", "from sheet2", "from sheet3"];
    const expectedResult = { ...connectState, sheetData };

    expect(
      connect(
        undefined,
        { type: CONNECT_SHEET_DATA, payload: sheetData }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_GET_LABELS
   */
  test("CONNECT_GET_LABELS", () => {
    const dbLabels = ["dbLabel1", "dbLabel2", "dbLabel3"];
    const expectedResult = { ...connectState, dbLabels };

    expect(
      connect(
        undefined,
        { type: CONNECT_GET_LABELS, payload: dbLabels }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_GET_GMAIL_THREADS
   */
  test("CONNECT_GET_GMAIL_THREADS", () => {
    const gmailThreads = ["thread1", "thread2", "thread3"];
    const expectedResult = { ...connectState, gmailThreads };

    expect(
      connect(
        undefined,
        { type: CONNECT_GET_GMAIL_THREADS, payload: gmailThreads }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_GET_DB_THREADS
   */
  test("CONNECT_GET_DB_THREADS", () => {
    const dbThreads = ["dbThread1", "dbThread2", "dbThread3"];
    const expectedResult = { ...connectState, dbThreads };

    expect(
      connect(
        undefined,
        { type: CONNECT_GET_DB_THREADS, payload: dbThreads }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_NEED_TO_CREATE
   */
  test("CONNECT_NEED_TO_CREATE", () => {
    const needToCreate = ["needToCreate1", "needToCreate2", "needToCreate3"];
    const expectedResult = { ...connectState, needToCreate };

    expect(
      connect(
        undefined,
        { type: CONNECT_NEED_TO_CREATE, payload: needToCreate }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_NEED_TO_UPDATE
   */
  test("CONNECT_NEED_TO_UPDATE", () => {
    const needToUpdate = ["needToUpdate1", "needToUpdate2", "needToUpdate3"];
    const expectedResult = { ...connectState, needToUpdate };

    expect(
      connect(
        undefined,
        { type: CONNECT_NEED_TO_UPDATE, payload: needToUpdate }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_NEED_TO_DELETE
   */
  test("CONNECT_NEED_TO_DELETE", () => {
    const needToDelete = ["needToDelete1", "needToDelete2", "needToDelete3"];
    const expectedResult = { ...connectState, needToDelete };

    expect(
      connect(
        undefined,
        { type: CONNECT_NEED_TO_DELETE, payload: needToDelete }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_GET_LABEL_MAP
   */
  test("CONNECT_GET_LABEL_MAP", () => {
    const labelMap = ["labelMap1", "labelMap2", "labelMap3"];
    const expectedResult = { ...connectState, labelMap };

    expect(
      connect(
        undefined,
        { type: CONNECT_GET_LABEL_MAP, payload: labelMap }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_GET_COMPRED
   */
  test("CONNECT_GET_COMPRED", () => {
    const compared = ["compared1", "compared2", "compared3"];
    const expectedResult = { ...connectState, compared };

    expect(
      connect(
        undefined,
        { type: CONNECT_GET_COMPRED, payload: compared }
      )
    ).toEqual(expectedResult);
  });

  /**
   * @CONNECT_UPDATE
   */
  test("CONNECT_UPDATE", () => {
    expect(
      connect(
        undefined,
        { type: CONNECT_UPDATE }
      )
    ).toEqual(connectState);
  });
});
