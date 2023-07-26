import { createFigma } from "../stubs";

describe("page ", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({
      simulateErrors: true
    });
  });

  it("assign empty backgrounds", () => {
    const page = figma.createPage();

    expect(() => {
      page.backgrounds = [];
    }).toThrow(
      "Error: in set_backgrounds: Page backgrounds must be a single solid paint"
    );
  });

  it("assign non solid background", () => {
    const page = figma.createPage();

    expect(() => {
      page.backgrounds = [
        {
          type: "GRADIENT_LINEAR",
          gradientTransform: [
            [0, 0, 0],
            [0, 0, 0]
          ],
          gradientStops: []
        }
      ];
    }).toThrow(
      "Error: in set_backgrounds: Page backgrounds must be a single solid paint"
    );
  });

  it("assign more than one backgrounds", () => {
    const page = figma.createPage();

    expect(() => {
      page.backgrounds = [
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.9607843160629272,
            g: 0.9607843160629272,
            b: 0.9607843160629272
          }
        },
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.9607843160629272,
            g: 0.9607843160629272,
            b: 0.9607843160629272
          }
        }
      ];
    }).toThrow(
      "Error: in set_backgrounds: Page backgrounds must be a single solid paint"
    );
  });

  it("assign correctly", () => {
    const page = figma.createPage();

    page.backgrounds = [
      {
        type: "SOLID",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        color: {
          r: 1,
          g: 0,
          b: 0
        }
      }
    ];

    expect((page.backgrounds[0] as any).color).toStrictEqual({
      r: 1,
      g: 0,
      b: 0
    });
  });
});
