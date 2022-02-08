import { createFigma } from "../stubs";

describe("allocating id", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  it("generates an instance that's connected to the main component", () => {
    const component = figma.createComponent();
    const instance = component.createInstance();
    expect(instance.mainComponent).toBe(component);
  });
});
