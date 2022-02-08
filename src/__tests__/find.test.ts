import { createFigma } from "../stubs";

describe("find functions", () => {
  beforeEach(() => {
    // @ts-ignore
    global.figma = createFigma({});
  });

  describe("findAll", () => {
    it("returns all children and subchildren that adheres to the given callback", () => {
      const component1 = figma.createComponent();
      const rect1 = figma.createRectangle();
      const rect2 = figma.createRectangle();
      const rect3 = figma.createRectangle();
      figma.group([rect1, rect2, rect3], component1);

      //   component1.appendChild(rectGroup);

      const foundChildren = component1.findAll(() => true);

      expect(foundChildren.length).toBe(4);
    });
  });

  describe("findOne", () => {
    it("returns the first child or subchild that adheres to the given callback", () => {
      const component1 = figma.createComponent();
      const rect1 = figma.createRectangle();
      rect1.name = "FIND_ME";
      const rect2 = figma.createRectangle();
      const rect3 = figma.createRectangle();

      figma.group([rect1, rect2, rect3], component1);

      const foundChild = component1.findOne(node => node.name === "FIND_ME");

      expect(foundChild).not.toBeNull();
      expect(foundChild).toBe(rect1);
    });
  });

  describe("findChildren", () => {
    it("returns all immediate children that adheres to the given callback", () => {
      const component1 = figma.createComponent();
      const rect1 = figma.createRectangle();
      rect1.name = "FIND_ME";
      const rect2 = figma.createRectangle();
      rect2.name = "FIND_ME";
      const rect3 = figma.createRectangle();
      rect3.name = "FIND_ME";

      figma.group([rect1], component1);
      component1.appendChild(rect2);
      component1.appendChild(rect3);

      //   component1.appendChild(rectGroup);

      const foundChildren = component1.findChildren(
        node => node.name === "FIND_ME"
      );

      expect(foundChildren.length).toBe(2);
      expect(foundChildren).toContain(rect2);
      expect(foundChildren).toContain(rect3);
    });
  });

  describe("findChild", () => {
    it("returns the first immediate child that adheres to the given callback", () => {
      const component1 = figma.createComponent();
      const rect1 = figma.createRectangle();
      rect1.name = "FIND_ME";
      const rect2 = figma.createRectangle();
      rect2.name = "FIND_ME";
      const rect3 = figma.createRectangle();
      rect3.name = "FIND_ME";

      figma.group([rect1], component1);
      component1.appendChild(rect2);
      component1.appendChild(rect3);

      //   component1.appendChild(rectGroup);

      const foundChild = component1.findChild(node => node.name === "FIND_ME");

      expect(foundChild).not.toBeNull();
      expect(foundChild).toBe(rect2);
    });
  });

  describe("findAllWithCriteria", () => {
    it("returns all children that match the specified types", () => {
      const component1 = figma.createComponent();
      const component2 = figma.createComponent();
      const rect1 = figma.createRectangle();
      const rect2 = figma.createRectangle();
      const rect3 = figma.createRectangle();
      const instance = component2.createInstance();

      component1.appendChild(rect1);
      component1.appendChild(rect2);
      component1.appendChild(rect3);
      component1.appendChild(instance);

      const foundChildren = component1.findAllWithCriteria({
        types: ["INSTANCE"]
      });

      expect(foundChildren.length).toBe(1);
      expect(foundChildren[0]).toBe(instance);
    });
  });
});
