import { createFigma, createParentPostMessage } from "../stubs";
import { jest } from "@jest/globals";

describe("postMessage", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
    // @ts-ignore
    global.parent = { postMessage: createParentPostMessage(global.figma) };
  });

  it("UI sends message and plugin receives it", async () => {
    let resolveWaiting;
    const waiting = new Promise<void>(resolve => {
      resolveWaiting = resolve;
    });
    // @ts-ignore
    figma.ui.onmessage = jest.fn().mockImplementation(() => {
      resolveWaiting();
    });
    parent.postMessage({ pluginMessage: "abc" }, "*");

    // Wait for post message to fire.
    await waiting;

    // @ts-ignore
    expect(figma.ui.onmessage).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(figma.ui.onmessage).toHaveBeenCalledWith("abc", expect.any(Object));
  });

  it("Plugin sends message and UI receives it", async () => {
    let resolveWaiting;
    const waiting = new Promise<void>(resolve => {
      resolveWaiting = resolve;
    });

    // @ts-ignore
    global.onmessage = jest.fn().mockImplementation(() => {
      resolveWaiting();
    });
    // @ts-ignore
    figma.ui.postMessage("abc");

    await waiting;

    //@ts-ignore
    expect(global.onmessage).toHaveBeenCalledTimes(1);
  });
});

describe('on("message")', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
    // @ts-ignore
    global.parent.postMessage = createParentPostMessage(global.figma);
  });

  it("can add a listener for a message", () => {
    const cb = jest.fn();
    figma.ui.on("message", cb);

    parent.postMessage({ pluginMessage: "abc" }, "*");
    parent.postMessage({ pluginMessage: "def" }, "*");

    jest.runAllTimers();

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith("abc", expect.any(Object));
    expect(cb).toHaveBeenCalledWith("def", expect.any(Object));
  });

  it("can remove a listener for a message", () => {
    const cb = jest.fn();
    figma.ui.on("message", cb);

    parent.postMessage({ pluginMessage: "abc" }, "*");

    jest.runAllTimers();

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith("abc", expect.any(Object));

    cb.mockClear();
    figma.ui.off("message", cb);

    parent.postMessage({ pluginMessage: "def" }, "*");

    expect(cb).not.toHaveBeenCalled();
  });

  it("can call a listener once", () => {
    const cb = jest.fn();
    figma.ui.once("message", cb);

    parent.postMessage({ pluginMessage: "abc" }, "*");
    parent.postMessage({ pluginMessage: "def" }, "*");

    jest.runAllTimers();

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith("abc", expect.any(Object));
  });
});
