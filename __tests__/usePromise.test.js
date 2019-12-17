import React from "react";
import makeTrashable from "trashable";
import { mount } from "enzyme";
import usePromise from "../src/";

jest.mock("trashable");

const TestComponent = ({ promises }) => {
  const promiseWrapper = usePromise();

  promises.forEach(promiseWrapper);

  return null;
};

describe("usePromise", () => {
  const mockTrash = jest.fn();
  makeTrashable.mockImplementation(promise => {
    promise.trash = mockTrash;
    return promise;
  });

  afterEach(() => {
    mockTrash.mockClear();
  });

  describe("when some promises are pending and the component unmounts", () => {
    it("should trash all unresolved promises", () => {
      const promises = [new Promise(() => {}), new Promise(() => {})];
      const component = mount(<TestComponent promises={promises} />);
      component.unmount();
      expect(mockTrash).toHaveBeenCalledTimes(2);
    });
  });

  describe("when all promises are resolved and the component unmounts", () => {
    it("should not try to trash anything", async () => {
      const promises = [Promise.resolve("1"), Promise.resolve("2")];
      const component = mount(<TestComponent promises={promises} />);
      await Promise.all(promises);
      component.unmount();
      expect(mockTrash).toHaveBeenCalledTimes(0);
    });
  });

  describe("when a mixture of promises are resolved, rejected and pending", () => {
    it("should only trash the pending promises", async () => {
      const promises = [
        Promise.resolve("1"),
        Promise.reject("2").catch(() => {}),
        new Promise(() => {})
      ];
      const component = mount(<TestComponent promises={promises} />);
      await Promise.all([promises[0], promises[1]]);
      component.unmount();
      expect(mockTrash).toHaveBeenCalledTimes(1);
    });
  });
});
