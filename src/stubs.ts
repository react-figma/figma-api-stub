import { applyMixins } from "./applyMixins";

class ChildrenMixinStub implements ChildrenMixin {
  children: Array<any>;
  appendChild(item) {
    if (!this.children) {
      this.children = [];
    }
    item.parent = this;
    this.children.push(item);
  }
  insertChild(index: number, child: BaseNode) {
    if (!this.children) {
      this.children = [];
    }
    // @ts-ignore
    child.parent = this;
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
}
applyMixins(TextNodeStub, [BaseNodeMixinStub, LayoutMixinStub]);

class DocumentNodeStub {
  type = "DOCUMENT";
}
applyMixins(DocumentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

class PageNodeStub {
  type = "PAGE";
}
applyMixins(PageNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

class FrameNodeStub {
  type = "FRAME";
}
applyMixins(FrameNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

class GroupNodeStub {
  type = "GROUP";
}
applyMixins(GroupNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

class ComponentNodeStub {
  type = "COMPONENT";
}
applyMixins(ComponentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

export const createFigma = (): PluginAPI => ({
  // @ts-ignore
  root: new DocumentNodeStub(),
  // @ts-ignore
  createPage: () => new PageNodeStub(),
  // @ts-ignore
  createFrame: () => new FrameNodeStub(),
  // @ts-ignore
  createComponent: () => new ComponentNodeStub(),
  // @ts-ignore
  createRectangle: () => new RectangleNodeStub(),
  // @ts-ignore
  createText: () => new TextNodeStub(),
  // @ts-ignore
  group: (nodes: any, parent: any, index) => {
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
});
