import { createFigma } from "../stubs";

describe("group", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({
      simulateErrors: true
    });
  });

  it("Applying constraints raises error", () => {
    const rect = figma.createRectangle();
    const group = figma.group([rect], figma.currentPage);
    expect(() => {
      // @ts-ignore
      group.constraints = {
        horizontal: "MIN",
        vertical: "MIN"
      };
    }).toThrowError(
      "Error: Cannot add property constraints, object is not extensible"
    );
  });
});
