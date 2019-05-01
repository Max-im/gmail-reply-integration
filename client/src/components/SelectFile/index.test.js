import React from "react";
import { shallow } from "enzyme";
import { isRender, isNotRender } from "../../../test/utils";
import { FilesList } from "./";

describe("FilesList", () => {
  const mockGetFiles = jest.fn();
  const initProps = {
    getFiles: mockGetFiles,
    input: { files: [], filesReady: true, filesError: null }
  };

  /*
   * componentDidMount should start getFiles function (fileIsRedy = true)
   */
  describe("componentDidMount should start getFiles function (fileIsRedy = true)", () => {
    const props = {
      ...initProps,
      input: { files: [], filesReady: true, filesError: null }
    };
    const fileList = shallow(<FilesList {...props} />);

    test("launch componentDidMount", () => {
      expect(mockGetFiles).toHaveBeenCalledTimes(0);
      fileList.instance().componentDidMount();
      expect(mockGetFiles).toHaveBeenCalledTimes(0);
    });
  });

  /*
   * componentDidMount should start getFiles function (fileIsRedy = false)
   */
  describe("componentDidMount should start getFiles function (fileIsRedy = false)", () => {
    const props = {
      ...initProps,
      input: { files: [], filesReady: false, filesError: null }
    };
    const fileList = shallow(<FilesList {...props} />);
    test("launch componentDidMount", () => {
      expect(mockGetFiles).toHaveBeenCalledTimes(0);
      fileList.instance().componentDidMount();
      expect(mockGetFiles).toHaveBeenCalledTimes(1);
    });
  });

  /*
   * Render components when files not ready
   */
  describe("Render components when files not ready", () => {
    const props = {
      ...initProps,
      input: { files: [], filesReady: false, filesError: null }
    };
    const fileList = shallow(<FilesList {...props} />);

    test("component", () => isRender(fileList, "filesList"));
    test("title", () => isRender(fileList, "filesList__title"));
    test("subtitle", () => isRender(fileList, "filesList__subtitle"));
    test("input", () => isNotRender(fileList, "filesList__input"));
    test("the list", () => isNotRender(fileList, "filesList__list"));
    test("error", () => isNotRender(fileList, "filesList__error"));
    test("overlay", () => isRender(fileList, "filesList__overlay"));
    test("search message", () => isRender(fileList, "filesList__searchMsg"));
    test("search message text", () => {
      expect(fileList.find("[data-test='filesList__searchMsg']").text()).toBe(
        ""
      );
    });
  });

  /*
   * Render components when files DO ready
   */
  describe("Render components when files DO ready", () => {
    const props = {
      ...initProps,
      input: { files: [], filesReady: true, filesError: null }
    };
    const fileList = shallow(<FilesList {...props} />);

    test("component", () => isRender(fileList, "filesList"));
    test("title", () => isRender(fileList, "filesList__title"));
    test("subtitle", () => isRender(fileList, "filesList__subtitle"));
    test("input", () => isRender(fileList, "filesList__input"));
    test("the list", () => isRender(fileList, "filesList__list"));
    test("error", () => isNotRender(fileList, "filesList__error"));
    test("overlay", () => isNotRender(fileList, "filesList__overlay"));
    test("search message", () => isRender(fileList, "filesList__searchMsg"));
    test("search message text", () => {
      expect(fileList.find("[data-test='filesList__searchMsg']").text()).toBe(
        "Files not found"
      );
    });
  });

  /*
   * Render error
   */
  describe("Error", () => {
    const expectError = "The Error Text";
    const props = { ...initProps };
    props.input.filesError = expectError;
    const fileList = shallow(<FilesList {...props} />);

    test("error renders", () => isRender(fileList, "filesList__error"));
    test("error text", () => {
      expect(fileList.find("[data-test='filesList__error']").text()).toBe(
        expectError
      );
    });
  });

  /*
   * list of the files [No filtred]
   */
  describe("list of the files [No filtred]", () => {
    const files = [
      { id: 1, name: "one" },
      { id: 2, name: "two" },
      { id: 3, name: "three" }
    ];
    const props = { ...initProps };
    props.input.files = files;

    const fileList = shallow(<FilesList {...props} />);

    test("list items", () => {
      expect(fileList.find("[data-test='filesList__item']").length).toBe(
        files.length
      );
    });
    test("links", () => {
      expect(fileList.find("[data-test='filesList__link']").length).toBe(
        files.length
      );
    });
    test("outer links", () => {
      expect(fileList.find("[data-test='filesList__outLink']").length).toBe(
        files.length
      );
    });
    test("search message text", () => {
      expect(fileList.find("[data-test='filesList__searchMsg']").text()).toBe(
        ""
      );
    });
  });

  /*
   * list of the files [Filtred]
   */
  describe("list of the files [Filtred]", () => {
    const files = [
      { id: 1, name: "one" },
      { id: 2, name: "two" },
      { id: 3, name: "three" }
    ];
    const search = "o";
    const props = { ...initProps };
    props.input.files = files;
    const matched = files.filter(item =>
      item.name.match(new RegExp(search, "gi"))
    ).length;

    const fileList = shallow(<FilesList {...props} />);

    test("list items", () => {
      expect(
        fileList.setState({ search }).find("[data-test='filesList__item']")
          .length
      ).toBe(matched);
    });

    test("links", () => {
      expect(
        fileList.setState({ search }).find("[data-test='filesList__link']")
          .length
      ).toBe(matched);
    });

    test("outer links", () => {
      expect(
        fileList.setState({ search }).find("[data-test='filesList__outLink']")
          .length
      ).toBe(matched);
    });
    test("search message text", () => {
      expect(fileList.find("[data-test='filesList__searchMsg']").text()).toBe(
        ""
      );
    });
  });

  /*
   * list of the files [Filtred noResults]
   */
  describe("list of the files [Filtred  noResults]", () => {
    const files = [
      { id: 1, name: "one" },
      { id: 2, name: "two" },
      { id: 3, name: "three" }
    ];
    const search = "oo";
    const props = { ...initProps };
    props.input.files = files;
    const fileList = shallow(<FilesList {...props} />);

    test("list items", () => {
      isNotRender(fileList.setState({ search }), "filesList__item");
    });

    test("search message text", () => {
      expect(
        fileList
          .setState({ search })
          .find("[data-test='filesList__searchMsg']")
          .text()
      ).toBe(`"${search}" not found`);
    });
  });

  /*
   * Input styling
   */
  describe("Input styling ", () => {
    const props = { ...initProps };
    const fileList = shallow(<FilesList {...props} />);

    beforeEach(() => fileList.setState({ onSearch: false }));

    test("init onSearch state = false", () => {
      expect(fileList.state().onSearch).toBe(false);
    });

    test("label dosnt have 'filesList__input' class", () => {
      expect(
        fileList
          .find("[data-test='filesList__input']")
          .hasClass("fileList__search_active")
      ).toBe(false);
    });

    test("label has 'filesList__input' class after focus", () => {
      fileList.find("[data-test='filesList__field']").simulate("focus");

      expect(
        fileList
          .find("[data-test='filesList__input']")
          .hasClass("fileList__search_active")
      ).toBe(true);
    });

    test("label dosnt have 'filesList__input' class after blur", () => {
      fileList.find("[data-test='filesList__field']").simulate("focus");
      fileList.find("[data-test='filesList__field']").simulate("blur");

      expect(
        fileList
          .find("[data-test='filesList__input']")
          .hasClass("fileList__search_active")
      ).toBe(false);
    });
  });
});
