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

  it("page ids increment", () => {
    const page1 = figma.currentPage;
    const page2 = figma.createPage();
    const page3 = figma.createPage();
    const page4 = figma.createPage();
    expect(page1.id).toEqual("0:1");
    expect(page2.id).toEqual("1:1");
    expect(page3.id).toEqual("2:1");
    expect(page4.id).toEqual("3:1");
  });

  it("node ids after page increment", () => {
    const page1 = figma.currentPage;
    const rect1 = figma.createRectangle();
    const rect2 = figma.createRectangle();
    const page2 = figma.createPage();
    const rect3 = figma.createRectangle();
    const rect4 = figma.createRectangle();
    expect(page1.id).toEqual("0:1");
    expect(rect1.id).toEqual("1:2");
    expect(rect2.id).toEqual("1:3");
    expect(page2.id).toEqual("1:1");
    expect(rect3.id).toEqual("2:5");
    expect(rect4.id).toEqual("2:6");
  });

  it("style id", () => {
    const style = figma.createPaintStyle();
    expect(style.id.length).toEqual(43);
  });
});
