import { applyMixins } from "./applyMixins";

class ChildrenMixinStub implements ChildrenMixin {
  children: Array<any>;
  appendChild(item) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(item);
  }
  insertChild(index: number, child: BaseNode) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(index, child);
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
  readonly id: string;
  readonly parent: (BaseNode & ChildrenMixin) | null;
  name: string;
  removed: boolean;
  private pluginData: { [key: string]: string };
  private sharedPluginData: { [namespace: string]: { [key: string]: string } };

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

class DocumentNodeStub {
  type = "DOCUMENT";
}
applyMixins(DocumentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

export const createFigma = (): PluginAPI => ({
  // @ts-ignore
  root: new DocumentNodeStub(),
  // @ts-ignore
  createRectangle: () => new RectangleNodeStub()
});
