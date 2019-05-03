import axios from "axios";
import { setAuthToken } from "./auth";

describe("utils/auth actions", () => {
  test("set header With User data", () => {
    const payload = "user data";
    setAuthToken(payload);
    expect(axios.defaults.headers.common["Authorization"]).toBe(payload);
  });

  test("set empty header", () => {
    setAuthToken(false);
    expect(axios.defaults.headers.common["Authorization"]).toBeUndefined();
  });
});
