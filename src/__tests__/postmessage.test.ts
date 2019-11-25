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
