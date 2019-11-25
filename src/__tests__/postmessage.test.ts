import { createParentPostMessage, createFigma } from "../stubs";

describe("postMessage", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
    // @ts-ignore
    global.parent.postMessage = createParentPostMessage(global.figma);
  });

  it("UI sends message and plugin receives it", () => {
    figma.ui.onmessage = jest.fn();
    parent.postMessage({ pluginMessage: "abc" }, "*");

    expect(figma.ui.onmessage).toHaveBeenCalledTimes(1);
    expect(figma.ui.onmessage).toHaveBeenCalledWith("abc", expect.any(Object));
  });

  it("Plugin sends message and UI receives it", () => {
    //@ts-ignore
    global.onmessage = jest.fn();
    figma.ui.postMessage("abc");
    //@ts-ignore
    expect(global.onmessage).toHaveBeenCalledTimes(1);
  });
});
