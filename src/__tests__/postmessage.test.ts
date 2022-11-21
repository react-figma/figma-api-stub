import { createParentPostMessage, createFigma } from "../stubs";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";

describe("postMessage", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
    // @ts-ignore
    global.parent.postMessage = createParentPostMessage(global.figma);
  });

  it("UI sends message and plugin receives it", async () => {
    const waiting = new Subject();
    // @ts-ignore
    figma.ui.onmessage = jest.fn().mockImplementation(() => waiting.next());
    parent.postMessage({ pluginMessage: "abc" }, "*");

    return new Promise(resolve => {
      waiting.pipe(take(1)).subscribe(() => {
        // @ts-ignore
        expect(figma.ui.onmessage).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(figma.ui.onmessage).toHaveBeenCalledWith(
          "abc",
          expect.any(Object)
        );
        resolve();
      });
    });
  });

  it("Plugin sends message and UI receives it", () => {
    const waiting = new Subject();

    //@ts-ignore
    global.onmessage = jest.fn().mockImplementation(() => waiting.next());
    // @ts-ignore
    figma.ui.postMessage("abc");

    return new Promise(resolve => {
      waiting.pipe(take(1)).subscribe(() => {
        //@ts-ignore
        expect(global.onmessage).toHaveBeenCalledTimes(1);
        resolve();
      });
    });
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
