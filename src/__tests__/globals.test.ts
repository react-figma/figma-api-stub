import { createFigma } from "../stubs";

describe("globals", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  it("can use showUI with global variables", () => {
    expect(() => {
      figma.showUI(__html__);
    }).not.toThrow();
    expect(() => {
      figma.showUI(__uiFiles__.secondary);
    }).not.toThrow();
  });
});
