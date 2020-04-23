import { createFigma } from "../stubs";

describe("allocating id", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  it("basic support", () => {
    const rect1 = figma.createRectangle();
    const rect2 = figma.createRectangle();
    expect(figma.root.id).toEqual("0:0");
    expect(figma.currentPage.id).toEqual("0:1");
    expect(rect1.id).toEqual("1:2");
    expect(rect2.id).toEqual("1:3");
  });
});
