import { applyMixins } from "./applyMixins";

type TConfig = {
  simulateErrors?: boolean;
};

const defaultConfig: TConfig = {
  simulateErrors: false
};

export const createFigma = (config: TConfig): PluginAPI => {
  const joinedConfig = { ...defaultConfig, ...config };
  const loadedFonts: Array<FontName> = [];
  const isFontLoaded = fontName => {
    return loadedFonts.find(
      font => font.family === fontName.family && font.style === fontName.style
    );
  };

  class ChildrenMixinStub implements ChildrenMixin {
    children: Array<any>;
    appendChild(item) {
      if (!this.children) {
        this.children = [];
      }
      if (item.parent) {
        item.parent.children = item.parent.children.filter(
          child => child !== item
        );
      }

      if (joinedConfig.simulateErrors && !item) {
        throw new Error("Error: empty child");
      }

      if (
        joinedConfig.simulateErrors &&
        // @ts-ignore
        this.type === "DOCUMENT" &&
        item.type !== "PAGE"
      ) {
        throw new Error(
          "Error: The root node cannot have children of type other than PAGE"
        );
      }
      item.parent = this;
      this.children.push(item);
    }
    insertChild(index: number, child: any) {
      if (!this.children) {
        this.children = [];
      }

      if (joinedConfig.simulateErrors && !child) {
        throw new Error("Error: empty child");
      }

      // @ts-ignore
      if (joinedConfig.simulateErrors && child.parent === this) {
        throw new Error("Error: Node already inside parent");
      }

      if (
        joinedConfig.simulateErrors &&
        // @ts-ignore
        this.type === "DOCUMENT" &&
        child.type !== "PAGE"
      ) {
        throw new Error(
          "Error: The root node cannot have children of type other than PAGE"
        );
      }
      if (child.parent) {
        child.parent.children = child.parent.children.filter(
          _child => child !== _child
        );
      }
      // @ts-ignore
      child.parent = this;
      this.children.splice(index, 0, child);
    }
    findAll(callback) {
      if (!this.children) {
        return [];
      }
      return this.children.filter(callback);
    }
    findOne(callback) {
      if (!this.children) {
        return null;
      }
      return this.children.find(callback);
    }
  }

  class BaseNodeMixinStub implements BaseNodeMixin {
    id: string;
    parent: (BaseNode & ChildrenMixin) | null;
    name: string;
    removed: boolean;
    pluginData: { [key: string]: string };
    sharedPluginData: { [namespace: string]: { [key: string]: string } };

    setPluginData(key: string, value: string) {
      if (!this.pluginData) {
        this.pluginData = {};
      }
      this.pluginData[key] = value;
    }
    getPluginData(key: string) {
      if (!this.pluginData) {
        return;
      }
      return this.pluginData[key];
    }
    setSharedPluginData(namespace: string, key: string, value: string) {
      if (!this.sharedPluginData) {
        this.sharedPluginData = {};
      }
      if (!this.sharedPluginData[namespace]) {
        this.sharedPluginData[namespace] = {};
      }
      this.pluginData[key] = value;
    }
    getSharedPluginData(namespace: string, key: string) {
      if (!this.sharedPluginData || !this.sharedPluginData[namespace]) {
        return;
      }
      return this.pluginData[namespace][key];
    }
    remove() {
      this.removed = true;
      if (this.parent) {
        // @ts-ignore
        this.parent.children = this.parent.children.filter(
          (child: any) => child !== this
        );
      }
    }
  }

  class LayoutMixinStub implements LayoutMixin {
    absoluteTransform: Transform;
    relativeTransform: Transform;
    x: number;
    y: number;
    rotation: number;

    width: number;
    height: number;

    resize(width, height) {
      this.width = width;
      this.height = height;
    }
    resizeWithoutConstraints(width, height) {
      this.width = width;
      this.height = height;
    }
  }

  class RectangleNodeStub {
    type = "RECTANGLE";
  }
  applyMixins(RectangleNodeStub, [BaseNodeMixinStub, LayoutMixinStub]);

  class TextNodeStub {
    type = "TEXT";
    private _fontName: FontName;
    private _characters: string;
    get fontName() {
      return this._fontName || { family: "Roboto", style: "Regular" };
    }
    set fontName(fontName) {
      if (joinedConfig.simulateErrors && !fontName) {
        throw new Error(`Error: fontName is undefined`);
      }
      this._fontName = fontName;
    }
    get characters() {
      return this._characters || "";
    }
    set characters(characters) {
      if (joinedConfig.simulateErrors && !isFontLoaded(this.fontName)) {
        throw new Error(
          `Error: font is not loaded ${this.fontName.family} ${this.fontName.style}`
        );
      }
      this._characters = characters;
    }
  }
  applyMixins(TextNodeStub, [BaseNodeMixinStub, LayoutMixinStub]);

  class DocumentNodeStub {
    type = "DOCUMENT";
    children = [];
  }
  applyMixins(DocumentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  class PageNodeStub {
    type = "PAGE";
    children = [];
  }
  applyMixins(PageNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  class FrameNodeStub {
    type = "FRAME";
    children = [];
  }
  applyMixins(FrameNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  class GroupNodeStub {
    type = "GROUP";
  }
  applyMixins(GroupNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  class ComponentNodeStub {
    type = "COMPONENT";
    children = [];
  }
  applyMixins(ComponentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  // @ts-ignore
  class PluginApiStub implements PluginAPI {
    root: DocumentNode;
    currentPage: PageNode;

    constructor() {
      // @ts-ignore
      this.root = new DocumentNodeStub();
      // @ts-ignore
      this.currentPage = new PageNodeStub();
      this.root.appendChild(this.currentPage);
    }

    // @ts-ignore
    createPage() {
      const result: any = new PageNodeStub();
      this.root.appendChild(result);
      return result;
    }

    // @ts-ignore
    createFrame() {
      const result: any = new FrameNodeStub();
      this.currentPage.appendChild(result);
      return result;
    }
    // @ts-ignore
    createComponent() {
      const result: any = new ComponentNodeStub();
      this.currentPage.appendChild(result);
      return result;
    }
    // @ts-ignore
    createRectangle() {
      const result: any = new RectangleNodeStub();
      this.currentPage.appendChild(result);
      return result;
    }
    // @ts-ignore
    createText() {
      const result: any = new TextNodeStub();
      this.currentPage.appendChild(result);
      return result;
    }
    // @ts-ignore
    group(nodes: any, parent: any, index) {
      if (joinedConfig.simulateErrors && (!nodes || nodes.length === 0)) {
        throw new Error(
          "Error: First argument must be an array of at least one node"
        );
      }

      const group: any = new GroupNodeStub();
      nodes.forEach(node => group.appendChild(node));
      if (index) {
        parent.insertChild(index, group);
      } else {
        parent.appendChild(group);
      }
      group.parent = parent;
      return group;
    }
    // @ts-ignore
    loadFontAsync(fontName) {
      if (isFontLoaded(fontName)) {
        return;
      }
      return new Promise(resolve => {
        loadedFonts.push(fontName);
        resolve();
      });
    }
  }

  // @ts-ignore
  return new PluginApiStub();
};
