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

  it("removed node throws error", () => {
    const rect = figma.createRectangle();
    rect.setPluginData("key", "value");
    rect.remove();
    expect(() => {
      rect.getPluginData("key");
    }).toThrow("The node with id 1:2 does not exist");
  });
});
