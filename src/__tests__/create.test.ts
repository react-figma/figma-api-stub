import { createFigma } from "../stubs";

describe("create", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  it("create image", async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const image = figma.createImage(bytes);
    expect(image.hash).toBeDefined();
    const _bytes = await image.getBytesAsync();
    expect(_bytes).toEqual(new Uint8Array([1, 2, 3]));
  });
});
