import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../../test/utils";
import { AccountsControl } from "./";

describe("Accounts Control", () => {
  const mockGetAccounts = jest.fn();
  const mockCreateAccount = jest.fn();
  const mockRemoveAccount = jest.fn();
  const accountsList = [
    {
      _id: "firstId",
      name: "firstName",
      email: "firstName@gmail.com"
    },
    {
      _id: "secondId",
      name: "secondName",
      email: "secondName@gmail.com"
    },
    {
      _id: "thirdId",
      name: "thirdName",
      email: "thirdName@gmail.com"
    }
  ];
  const initProps = {
    getAccounts: mockGetAccounts,
    createAccount: mockCreateAccount,
    removeAccount: mockRemoveAccount,
    accounts: { accounts: accountsList, inProcess: true, error: null }
  };

  /*
   * should launch getting accounts
   */
  describe("should launch getting accounts", () => {
    const accounts = shallow(<AccountsControl {...initProps} />);

    test("launch by componentDidMount", () => {
      expect(mockGetAccounts).toHaveBeenCalledTimes(0);
      accounts.instance().componentDidMount();
      expect(mockGetAccounts).toHaveBeenCalledTimes(1);
    });
  });

  /*
   * should launch removing accounts
   */
  describe("should launch removing accounts", () => {
    const accounts = shallow(<AccountsControl {...initProps} />);

    test("launch by remove btn click", () => {
      expect(mockRemoveAccount).toHaveBeenCalledTimes(0);

      accounts
        .find("[data-test='accounts__remove']")
        .forEach((removeBtn, i) => {
          removeBtn.at(i).simulate("click");
          expect(mockRemoveAccount).toHaveBeenCalledTimes(i + 1);
          expect(mockRemoveAccount).toHaveBeenCalledWith(accountsList[i]._id);
        });
    });
  });

  /*
   * should launch creating accounts
   */
  // TODO test creating accounts
  // ==================================================

  /*
   * should render propertly [inProcess]
   */
  describe("should render propertly [inProcess]", () => {
    const props = { ...initProps };
    const accounts = shallow(<AccountsControl {...props} />);

    test("component", () => isRender(accounts, "accounts"));
    test("subtitle", () => isRender(accounts, "accounts__subtitle"));
    test("content", () => isNotRender(accounts, "accounts__content"));
    test("create btn", () => isNotRender(accounts, "accounts__create"));
    test("items", () => isNotRender(accounts, "accounts__item"));
    test("error", () => isNotRender(accounts, "accounts__error"));
  });

  /*
   * should render propertly [!inProcess]
   */
  describe("should render propertly [!inProcess]", () => {
    const props = { ...initProps };
    props.accounts.inProcess = false;
    const accounts = shallow(<AccountsControl {...props} />);

    test("component", () => isRender(accounts, "accounts"));
    test("subtitle", () => isRender(accounts, "accounts__subtitle"));
    test("content", () => isRender(accounts, "accounts__content"));
    test("create btn", () => isRender(accounts, "accounts__create"));
    test("items", () => isRender(accounts, "accounts__item"));
    test("error", () => isNotRender(accounts, "accounts__error"));
    test("items amount", () => {
      expect(accounts.find("[data-test='accounts__item']").length).toBe(
        accountsList.length
      );
    });
    test("items text", () => {
      accounts.find("[data-test='accounts__name']").forEach((item, i) => {
        expect(item.text()).toBe(accountsList[i].name);
      });
    });
    test("items email", () => {
      accounts.find("[data-test='accounts__email']").forEach((item, i) => {
        expect(item.text()).toBe(accountsList[i].email);
      });
    });
  });

  /*
   * should render propertly [with error]
   */
  describe("should render propertly [with error]", () => {
    const expectedError = "expectedError";
    const props = { ...initProps };
    props.accounts.error = expectedError;
    const accounts = shallow(<AccountsControl {...props} />);

    test("component", () => isRender(accounts, "accounts"));
    test("error", () => isRender(accounts, "accounts__error"));
    test("error text", () => {
      expect(accounts.find("[data-test='accounts__error']").text()).toBe(
        expectedError
      );
    });
  });
});
