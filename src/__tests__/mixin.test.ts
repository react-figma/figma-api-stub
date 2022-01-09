import { createFigma } from "../stubs";

describe("Mixin", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({
      simulateErrors: true
    });
  });

  it("GeometryMixin", () => {
    const page = figma.createPage();
    const text = figma.createText();
    const frame = figma.createFrame();
    const instance = figma.createComponent().createInstance();

    expect("fills" in figma.root).toBeFalsy();
    expect("fills" in page).toBeFalsy();
    expect("fills" in instance).toBeFalsy();
    expect("fills" in frame).toBeTruthy();
    expect("fills" in text).toBeTruthy();
  });
});
