import { createFigma } from "../stubs";

describe("components ", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  it("generates an instance that's connected to the main component", () => {
    const component = figma.createComponent();
    const instance = component.createInstance();
    expect(instance.mainComponent).toBe(component);
  });

  it("create ShapeWithTextNode", () => {
    const shapeWithTextNode = figma.createShapeWithText();

    expect(shapeWithTextNode.type).toBe("SHAPE_WITH_TEXT");
    expect(shapeWithTextNode.text.characters).toStrictEqual("");
  });

  it("group two nodes ", () => {
    const tN1 = figma.createText();
    tN1.name = "sampleTextNode";
    tN1.locked = false;
    tN1.visible = true;
    tN1.characters = "This is sample text";
    const tN2 = figma.createText();

    tN2.name = "anotherSampleTextNode";
    tN2.locked = false;
    tN2.visible = true;
    tN2.characters = "This is another sample text.";

    figma.group([tN1, tN2], figma.currentPage, 0);
    expect(figma.currentPage.children.length).toBe(1);
    expect(figma.currentPage.children[0].type).toBe("GROUP");
    const innerGroup = figma.currentPage.children[0] as GroupNode;
    expect(innerGroup.children.length).toBe(2);
    expect(innerGroup.children[0].id).toBe(tN1.id);
    expect(innerGroup.children[1].id).toBe(tN2.id);
  });

  it("union two nodes ", () => {
    const tN1 = figma.createText();
    tN1.name = "sampleTextNode";
    tN1.locked = false;
    tN1.visible = true;
    tN1.characters = "This is sample text";
    const tN2 = figma.createText();

    tN2.name = "anotherSampleTextNode";
    tN2.locked = false;
    tN2.visible = true;
    tN2.characters = "This is another sample text.";

    figma.union([tN1, tN2], figma.currentPage, 0);
    expect(figma.currentPage.children.length).toBe(1);
    expect(figma.currentPage.children[0].type).toBe("BOOLEAN_OPERATION");
    expect(
      (figma.currentPage.children[0] as BooleanOperationNode).booleanOperation
    ).toBe("UNION");

    const innerUnion = figma.currentPage.children[0] as BooleanOperationNode;
    expect(innerUnion.children.length).toBe(2);
    expect(innerUnion.children[0].id).toBe(tN1.id);
    expect(innerUnion.children[1].id).toBe(tN2.id);
  });
});
