import { TConfig } from "./config";

export const isInsideInstance = node => {
  if (!node.parent) {
    return;
  }
  return node.parent.type === "INSTANCE" || isInsideInstance(node.parent);
};

export const getChildrenMixinStub = (config: TConfig) =>
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

      if (config.simulateErrors && !item) {
        throw new Error("Error: empty child");
      }

      if (
        config.simulateErrors &&
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

      if (config.simulateErrors && !child) {
        throw new Error("Error: empty child");
      }

      // @ts-ignore
      if (config.simulateErrors && child.parent === this) {
        throw new Error("Error: Node already inside parent");
      }

      if (
        config.simulateErrors &&
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

    findAllWithCriteria<T extends NodeType[]>(criteria: { types: T }) {
      const typeLookup = new Set(criteria.types);
      return this.findAll(() => true).filter(child =>
        typeLookup.has(child.type)
      );
    }

    findAll(callback) {
      if (!this.children) {
        return [];
      }
      const matchingChildren = [];
      this.children.forEach(child => {
        if (callback(child)) {
          matchingChildren.push(child);
        }
        if ("findAll" in child) {
          matchingChildren.push(...child.findAll(callback));
        }
      });
      return matchingChildren;
    }

    findOne(callback) {
      const matches = this.findAll(callback);
      if (matches.length > 0) {
        return matches[0];
      }
      return null;
    }

    findChild(callback) {
      if (!this.children) {
        return null;
      }
      return this.children.find(callback);
    }

    findChildren(callback) {
      if (!this.children) {
        return null;
      }
      return this.children.filter(callback);
    }

    findWidgetNodesByWidgetId(widgetId: string): WidgetNode[] {
      return [];
    }
  };

export const getBaseNodeMixinStub = (config: TConfig) =>
  class BaseNodeMixinStub implements BaseNodeMixin {
    id: string;
    parent: (BaseNode & ChildrenMixin) | null;
    name: string;
    removed: boolean;
    relaunchData: { [command: string]: string };
    pluginData: { [key: string]: string };
    sharedPluginData: { [namespace: string]: { [key: string]: string } };

    readonly isAsset: boolean;
    async getCSSAsync(): Promise<{
      [key: string]: string;
    }> {
      return {};
    }

    // instance nodes that are cloned from components will have `_orig` set to
    // the value of the original node. This is used internally for inheriting
    // things like plugin data and relaunch data
    _orig: BaseNodeMixin | null = null;

    setPluginData(key: string, value: string) {
      if (!this.pluginData) {
        this.pluginData = {};
      }
      if (value === "") {
        delete this.pluginData[key];
      } else {
        this.pluginData[key] = value;
      }
    }

    getPluginData(key: string) {
      if (config.simulateErrors && this.removed) {
        throw new Error(`The node with id ${this.id} does not exist`);
      }

      // first, try to retrieve the key from local plugin data
      if (this.pluginData && this.pluginData[key]) {
        return this.pluginData[key];
      }
      // if we don't find the key in local plugin data, try and retrieve it from
      // the original node it was cloned from, if it exists if
      if (this._orig) {
        return this._orig.getPluginData(key);
      }
      // otherwise, return nothing
      return;
    }

    getPluginDataKeys(): string[] {
      if (config.simulateErrors && this.removed) {
        throw new Error(`The node with id ${this.id} does not exist`);
      }
      // get all local and inherited keys
      const localKeys = this.pluginData ? Object.keys(this.pluginData) : [];
      const inheritedKeys = this._orig ? this._orig.getPluginDataKeys() : [];

      // combine them into one list and de-dupe any copies
      const combinedKeys = Array.from(
        new Set([...localKeys, ...inheritedKeys])
      );
      return combinedKeys;
    }

    setSharedPluginData(namespace: string, key: string, value: string) {
      if (!this.sharedPluginData) {
        this.sharedPluginData = {};
      }
      if (!this.sharedPluginData[namespace]) {
        this.sharedPluginData[namespace] = {};
      }
      if (value === "") {
        delete this.sharedPluginData[namespace][key];
        // if (Object.keys(this.sharedPluginData[namespace]).length === 0) {
        //   delete this.sharedPluginData[namespace];
        // }
      } else {
        this.sharedPluginData[namespace][key] = value;
      }
    }

    getSharedPluginData(namespace: string, key: string) {
      // first, try to retrieve the key from local plugin data
      if (
        this.sharedPluginData &&
        this.sharedPluginData[namespace] &&
        this.sharedPluginData[namespace][key]
      ) {
        return this.sharedPluginData[namespace][key];
      }
      // if we don't find the key in local plugin data, try and retrieve it from
      // the original node it was cloned from, if it exists if
      if (this._orig) {
        return this._orig.getSharedPluginData(namespace, key);
      }
      // otherwise, return nothing
      return;
    }

    getSharedPluginDataKeys(namespace: string): string[] {
      // get all local and inherited keys
      const localKeys =
        this.sharedPluginData && this.sharedPluginData[namespace]
          ? Object.keys(this.sharedPluginData[namespace])
          : [];
      const inheritedKeys = this._orig
        ? this._orig.getSharedPluginDataKeys(namespace)
        : [];

      // combine them into one list and de-dupe any copies
      const combinedKeys = Array.from(
        new Set([...localKeys, ...inheritedKeys])
      );
      return combinedKeys;
    }

    setRelaunchData(data: { [command: string]: string }) {
      this.relaunchData = data;
    }

    getRelaunchData(): { [command: string]: string } {
      return this.relaunchData || {};
    }

    remove() {
      this.removed = true;
      if (config.simulateErrors && isInsideInstance(this)) {
        throw new Error("Error: can't remove item");
      }
      if (this.parent) {
        // @ts-ignore
        this.parent.children = this.parent.children.filter(
          (child: any) => child !== this
        );
      }
    }

    async getDevResourcesAsync(options?: {
      includeChildren?: boolean;
    }): Promise<DevResourceWithNodeId[]> {
      return [];
    }
    async addDevResourceAsync(url: string, name?: string): Promise<void> {}
    async editDevResourceAsync(
      currentUrl: string,
      newValue: {
        name?: string;
        url?: string;
      }
    ): Promise<void> {}
    async deleteDevResourceAsync(url: string): Promise<void> {}
    async setDevResourcePreviewAsync(
      url: string,
      preview: PlainTextElement
    ): Promise<void> {}
  };

export const getLayoutMixinStub = (config: TConfig) =>
  class LayoutMixinStub implements LayoutMixin {
    layoutGrow: number;
    rescale(scale: number): void {
      if (config.simulateErrors && scale < 0.01) {
        throw new Error(
          'Error: in rescale: Expected "scale" to have value >= 0.01'
        );
      }
      this.width = this.width * scale;
      this.height = this.height * scale;
    }
    absoluteTransform: Transform;
    relativeTransform: Transform;
    x: number;
    y: number;
    rotation: number;
    layoutSizingHorizontal: "FIXED" | "HUG" | "FILL";
    layoutSizingVertical: "FIXED" | "HUG" | "FILL";

    width: number;
    height: number;
    minWidth: number | null;
    maxWidth: number | null;
    minHeight: number | null;
    maxHeight: number | null;

    constrainProportions: boolean;
    layoutAlign: LayoutMixin["layoutAlign"];
    layoutPositioning: AutoLayoutChildrenMixin["layoutPositioning"];

    absoluteRenderBounds: Rect | null;
    absoluteBoundingBox: Rect | null;

    resize(width, height) {
      if (config.simulateErrors && isInsideInstance(this)) {
        throw new Error("Error: can't change layout inside item");
      }
      if (config.simulateErrors && width < 0.01) {
        throw new Error(
          'Error: in resize: Expected "width" to have value >= 0.01'
        );
      }
      if (config.simulateErrors && height < 0.01) {
        throw new Error(
          'Error: in resize: Expected "height" to have value >= 0.01'
        );
      }
      this.width = width;
      this.height = height;
    }

    resizeWithoutConstraints(width, height) {
      this.width = width;
      this.height = height;
    }
  };

export class ExportMixinStub implements ExportMixin {
  exportSettings: ReadonlyArray<ExportSettings>;

  exportAsync(settings: ExportSettingsSVGString): Promise<string>;
  exportAsync(settings: ExportSettingsREST): Promise<Object>;
  exportAsync(settings?: ExportSettings): Promise<Uint8Array>;
  exportAsync(
    settings:
      | ExportSettingsSVGString
      | ExportSettingsREST
      | ExportSettings
      | undefined
  ): Promise<string | Object | Uint8Array> {
    // "exportAsync" is not implemented in stubs
    return Promise.resolve(new Uint8Array());
  }
}

export class GeometryMixinStub implements GeometryMixin {
  private _fills: ReadonlyArray<Paint> | PluginAPI["mixed"];
  get fills() {
    return this._fills || [];
  }
  set fills(theFills) {
    this._fills = theFills;
  }
  strokes: ReadonlyArray<Paint>;
  strokeWeight: number;
  strokeMiterLimit: number;
  strokeAlign: "CENTER" | "INSIDE" | "OUTSIDE";
  strokeCap: StrokeCap | PluginAPI["mixed"];
  strokeJoin: StrokeJoin | PluginAPI["mixed"];
  dashPattern: ReadonlyArray<number>;
  fillStyleId: string | PluginAPI["mixed"];
  strokeStyleId: string;
  strokeGeometry: VectorPaths;
  fillGeometry: VectorPaths;
  outlineStroke() {
    return null;
  }
}
