import { createFigma } from "../stubs";

describe("getPluginData", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({
      simulateErrors: true
    });
  });

  it("basic support", () => {
    const rect = figma.createRectangle();
    rect.setPluginData("key", "value");
    expect(rect.getPluginData("key")).toEqual("value");
  });

  it("can retreive keys", () => {
    const rect = figma.createRectangle();
    rect.setPluginData("key1", "value");
    rect.setPluginData("key2", "value");
    expect(rect.getPluginDataKeys()).toEqual(["key1", "key2"]);
  });

  it("removed node throws error", () => {
    const rect = figma.createRectangle();
    rect.setPluginData("key", "value");
    rect.remove();
    expect(() => {
      rect.getPluginData("key");
    }).toThrow("The node with id 1:2 does not exist");
  });
});
