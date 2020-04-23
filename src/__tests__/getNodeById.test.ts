import { createFigma } from "../stubs";

describe("getNodeById", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
    // @ts-ignore
    figma.root.id = "0:0";
  });

  it("finding figma root", () => {
    // @ts-ignore
    figma.root.id = "0:0";
    const root = figma.getNodeById("0:0");
    expect(figma.root).toEqual(root);
  });

  it("finding nested node ", () => {
    const page = figma.createPage();
    figma.root.appendChild(page);

    const frame = figma.createFrame();
    page.appendChild(frame);

    const rect1 = figma.createRectangle();
    // @ts-ignore
    rect1.id = "2:1";
    const rect2 = figma.createRectangle();
    // @ts-ignore
    rect2.id = "2:2";
    const rect3 = figma.createRectangle();
    // @ts-ignore
    rect3.id = "2:2";
    frame.appendChild(rect1);
    frame.appendChild(rect2);
    frame.appendChild(rect3);

    const rect2Found = figma.getNodeById("2:2");
    expect(rect2Found.id).toEqual("2:2");
  });
});
