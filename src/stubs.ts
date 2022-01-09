import * as cloneDeep from "clone-deep";
import { Subject, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { applyMixins } from "./applyMixins";
import { Helvetica, Roboto } from "./fonts";
import { nanoid } from "nanoid";

type TConfig = {
  simulateErrors?: boolean;
  isWithoutTimeout?: boolean;
};

const defaultConfig: TConfig = {
  simulateErrors: false,
  isWithoutTimeout: false
};

const isInsideInstance = node => {
  if (!node.parent) {
    return;
  }
  return node.parent.type === "INSTANCE" || isInsideInstance(node.parent);
};

export const createFigma = (config: TConfig): PluginAPI => {
  const joinedConfig = { ...defaultConfig, ...config };
  const loadedFonts: Array<FontName> = [];
  const isFontLoaded = fontName => {
    return loadedFonts.find(
      font => font.family === fontName.family && font.style === fontName.style
    );
  };

  const selectionChangeSubject = new Subject();
  const selectionChangeSubscribes = new Map<Function, Subscription>();

  const currentPageChangeSubject = new Subject();
  const currentPageChangeSubscribes = new Map<Function, Subscription>();

  let majorId = 1;
  let minorId = 1;
  const allocateNodeId = (node, shouldIncreaseMajor?: boolean) => {
    minorId += 1;
    if (!shouldIncreaseMajor) {
      node.id = `${majorId}:${minorId}`;
    } else {
      node.id = `${majorId}:${1}`;
      majorId += 1;
    }
  };

  const allocateStyleId = style => {
    style.id = `S:${nanoid(40)},`;
  };

  const getImageHash = () => {
    return nanoid(40);
  };

  class UIAPIStub {
    onmessage: MessageEventHandler | undefined;

    postMessage(pluginMessage: any, options?: UIPostMessageOptions): void {
      const message = {
        data: { pluginMessage, pluginId: "000000000000000000" },
        type: "message"
      };

      // @ts-ignore
      if (global && global.onmessage) {
        if (config.isWithoutTimeout) {
          // @ts-ignore
          global.onmessage(message);
        } else {
          setTimeout(() => {
            // @ts-ignore
            global.onmessage(message);
          }, 0);
        }
      }
    }
  }

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
      if (joinedConfig.simulateErrors && this.removed) {
        throw new Error(`The node with id ${this.id} does not exist`);
      }
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
      this.sharedPluginData[namespace][key] = value;
    }

    getSharedPluginData(namespace: string, key: string) {
      if (!this.sharedPluginData || !this.sharedPluginData[namespace]) {
        return;
      }
      return this.sharedPluginData[namespace][key];
    }

    setRelaunchData(data) {
      // TODO: Implement this method
      console.warn('"setRelaunchData" is not implemented. Skipped', data);
    }

    remove() {
      this.removed = true;
      if (joinedConfig.simulateErrors && isInsideInstance(this)) {
        throw new Error("Error: can't remove item");
      }
      if (this.parent) {
        // @ts-ignore
        this.parent.children = this.parent.children.filter(
          (child: any) => child !== this
        );
      }
    }
  }

  class LayoutMixinStub implements LayoutMixin {
    layoutGrow: number;
    rescale(scale: number): void {
      if (joinedConfig.simulateErrors && scale < 0.01) {
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

    width: number;
    height: number;

    constrainProportions: boolean;
    layoutAlign: LayoutMixin["layoutAlign"];

    resize(width, height) {
      if (joinedConfig.simulateErrors && isInsideInstance(this)) {
        throw new Error("Error: can't change layout inside item");
      }
      if (joinedConfig.simulateErrors && width < 0.01) {
        throw new Error(
          'Error: in resize: Expected "width" to have value >= 0.01'
        );
      }
      if (joinedConfig.simulateErrors && height < 0.01) {
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
  }

  class ExportMixinStub implements ExportMixin {
    exportSettings: ReadonlyArray<ExportSettings>;

    exportAsync(settings?: ExportSettings) {
      // "exportAsync" is not implemented in stubs
      return Promise.resolve(new Uint8Array());
    }
  }

  class RectangleNodeStub {
    type = "RECTANGLE";
  }

  applyMixins(RectangleNodeStub, [
    BaseNodeMixinStub,
    LayoutMixinStub,
    ExportMixinStub
  ]);

  class TextNodeStub {
    type = "TEXT";
    private _fontName: FontName;
    private _characters: string;
    private _textAutoResize: string;
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
    get textAutoResize() {
      return this._textAutoResize;
    }
    set textAutoResize(value) {
      if (joinedConfig.simulateErrors && !isFontLoaded(this.fontName)) {
        throw new Error(
          `Error: font is not loaded ${this.fontName.family} ${this.fontName.style}`
        );
      }
      this._textAutoResize = value;
    }
    getRangeFontName(
      start: number,
      end: number
    ): FontName | PluginAPI["mixed"] {
      if (joinedConfig.simulateErrors && start < 0) {
        throw new Error(`Error: Expected "start" to have value >=0`);
      }
      if (joinedConfig.simulateErrors && end < 0) {
        throw new Error(`Error: Expected "end" to have value >=0`);
      }
      if (joinedConfig.simulateErrors && end > this._characters.length) {
        throw new Error(
          `Error: Range outside of available characters. 'start' must be less than node.characters.length and 'end' must be less than or equal to node.characters.length`
        );
      }
      if (joinedConfig.simulateErrors && end === start) {
        throw new Error(
          `Error: Empty range selected. 'end' must be greater than 'start'`
        );
      }
      return this._fontName || { family: "Roboto", style: "Regular" };
    }
    deleteCharacters(start: number, end: number): void {
      if (joinedConfig.simulateErrors && !isFontLoaded(this.fontName)) {
        throw new Error(
          `Error: font is not loaded ${this.fontName.family} ${this.fontName.style}`
        );
      }
      if (joinedConfig.simulateErrors && start < 0) {
        throw new Error(`Error: Expected "start" to have value >=0`);
      }
      if (joinedConfig.simulateErrors && end < 0) {
        throw new Error(`Error: Expected "end" to have value >=0`);
      }
      if (joinedConfig.simulateErrors && end > this._characters.length) {
        throw new Error(
          `Error: Cannot delete characters at index greater than the length of the text`
        );
      }
      this._characters =
        this._characters.slice(start, end) +
        (end === this._characters.length
          ? ""
          : this._characters.slice(end + 1));
    }
    insertCharacters(
      start: number,
      characters: string,
      _useStyle: "BEFORE" | "AFTER" = "BEFORE"
    ): void {
      if (joinedConfig.simulateErrors && !isFontLoaded(this.fontName)) {
        throw new Error(
          `Error: font is not loaded ${this.fontName.family} ${this.fontName.style}`
        );
      }
      if (joinedConfig.simulateErrors && start < 0) {
        throw new Error(`Error: Expected "start" to have value >=0`);
      }
      if (joinedConfig.simulateErrors && start > this._characters.length) {
        throw new Error(
          `Error: Cannot insert characters at index greater than the length of the text`
        );
      }
      this._characters = [
        this._characters.slice(0, start),
        characters,
        this._characters.slice(start)
      ].join("");
    }
  }

  applyMixins(TextNodeStub, [
    BaseNodeMixinStub,
    LayoutMixinStub,
    ExportMixinStub
  ]);

  class DocumentNodeStub {
    type = "DOCUMENT";
    children = [];
  }

  applyMixins(DocumentNodeStub, [BaseNodeMixinStub, ChildrenMixinStub]);

  class PageNodeStub {
    type = "PAGE";
    children = [];
    _selection: Array<SceneNode>;

    get selection() {
      return this._selection || [];
    }

    set selection(value) {
      this._selection = value;
      selectionChangeSubject.next();
    }
  }

  applyMixins(PageNodeStub, [
    BaseNodeMixinStub,
    ChildrenMixinStub,
    ExportMixinStub
  ]);

  class FrameNodeStub {
    type = "FRAME";
    children = [];
  }

  applyMixins(FrameNodeStub, [
    BaseNodeMixinStub,
    ChildrenMixinStub,
    LayoutMixinStub,
    ExportMixinStub
  ]);

  class GroupNodeStub {
    type = "GROUP";

    set constraints(value) {
      if (joinedConfig.simulateErrors) {
        throw new Error(
          `Error: Cannot add property constraints, object is not extensible`
        );
      }
    }
  }

  applyMixins(GroupNodeStub, [
    BaseNodeMixinStub,
    ChildrenMixinStub,
    ExportMixinStub,
    LayoutMixinStub
  ]);

  class ComponentNodeStub {
    type = "COMPONENT";
    children = [];
    createInstance() {
      const instance = new InstanceNodeStub();
      instance.children = cloneDeep(this.children);
      return instance;
    }
  }

  applyMixins(ComponentNodeStub, [
    BaseNodeMixinStub,
    ChildrenMixinStub,
    ExportMixinStub,
    LayoutMixinStub
  ]);

  class InstanceNodeStub {
    type = "INSTANCE";
    children: any;

    detachInstance(): void {
      this.type = "FRAME";
    }
  }

  applyMixins(InstanceNodeStub, [
    BaseNodeMixinStub,
    ExportMixinStub,
    LayoutMixinStub
  ]);

  // --- styles

  const styles = new Map<string, BaseStyle>();
  const paintStyles = [];
  const effectStyles = [];
  const textStyles = [];
  const gridStyles = [];

  class BaseStyleStub implements BaseStyle {
    id: string;
    type: StyleType;
    name: string;
    description: string;
    remote: boolean = false;
    key: string;

    remove(): void {
      styles.delete(this.id);
    }

    async getPublishStatusAsync(): Promise<PublishStatus> {
      return await "UNPUBLISHED";
    }
  }

  class PaintStyleStub extends BaseStyleStub implements PaintStyle {
    // @ts-ignore
    type = "PAINT" as StyleType;
    paints: readonly Paint[];

    remove() {
      super.remove();
      paintStyles.splice(paintStyles.indexOf(this), 1);
    }
  }

  class EffectStyleStub extends BaseStyleStub implements EffectStyle {
    // @ts-ignore
    type = "EFFECT" as StyleType;
    effects: readonly Effect[];

    remove() {
      super.remove();
      effectStyles.splice(effectStyles.indexOf(this), 1);
    }
  }

  class TextStyleStub extends BaseStyleStub implements TextStyle {
    // @ts-ignore
    type = "TEXT" as StyleType;
    fontName: FontName;
    fontSize: number;
    letterSpacing: LetterSpacing;
    lineHeight: LineHeight;
    paragraphIndent: number;
    paragraphSpacing: number;
    textCase: TextCase;
    textDecoration: TextDecoration;

    remove() {
      super.remove();
      textStyles.splice(textStyles.indexOf(this), 1);
    }
  }

  class GridStyleStub extends BaseStyleStub implements GridStyle {
    // @ts-ignore
    type = "GRID" as StyleType;
    layoutGrids: readonly LayoutGrid[];

    remove() {
      super.remove();
      gridStyles.splice(gridStyles.indexOf(this), 1);
    }
  }

  // @ts-ignore
  class PluginApiStub implements PluginAPI {
    root: DocumentNode;
    _currentPage: PageNode;
    readonly ui: UIAPI;

    constructor() {
      // @ts-ignore
      this.root = new DocumentNodeStub();
      // @ts-ignore
      this.root.id = "0:0";
      // @ts-ignore
      this._currentPage = new PageNodeStub();
      // @ts-ignore
      this._currentPage.id = "0:1";
      this.root.appendChild(this._currentPage);
      // @ts-ignore
      this.ui = new UIAPIStub();
    }

    get currentPage() {
      return this._currentPage;
    }

    set currentPage(value) {
      this._currentPage = value;
      currentPageChangeSubject.next();
    }

    // @ts-ignore
    createPage() {
      const result: any = new PageNodeStub();
      allocateNodeId(result, true);
      this.root.appendChild(result);
      return result;
    }

    // @ts-ignore
    createFrame() {
      const result: any = new FrameNodeStub();
      allocateNodeId(result);
      this.currentPage.appendChild(result);
      return result;
    }

    // @ts-ignore
    createComponent() {
      const result: any = new ComponentNodeStub();
      allocateNodeId(result);
      this.currentPage.appendChild(result);
      return result;
    }

    // @ts-ignore
    createRectangle() {
      const result: any = new RectangleNodeStub();
      allocateNodeId(result);
      this.currentPage.appendChild(result);
      return result;
    }

    // @ts-ignore
    createText() {
      const result: any = new TextNodeStub();
      allocateNodeId(result);
      this.currentPage.appendChild(result);
      return result;
    }

    getStyleById(id) {
      if (styles.has(id)) {
        return styles.get(id);
      }

      return null;
    }

    getLocalPaintStyles() {
      return paintStyles;
    }

    getLocalEffectStyles() {
      return effectStyles;
    }

    getLocalTextStyles() {
      return textStyles;
    }

    getLocalGridStyles() {
      return gridStyles;
    }

    // @ts-ignore
    createPaintStyle() {
      const style = new PaintStyleStub();
      allocateStyleId(style);
      styles.set(style.id, style);
      paintStyles.push(style);
      return style;
    }

    // @ts-ignore
    createEffectStyle() {
      const style = new EffectStyleStub();
      allocateStyleId(style);
      styles.set(style.id, style);
      effectStyles.push(style);
      return style;
    }

    // @ts-ignore
    createTextStyle() {
      const style = new TextStyleStub();
      allocateStyleId(style);
      styles.set(style.id, style);
      textStyles.push(style);
      return style;
    }

    // @ts-ignore
    createGridStyle() {
      const style = new GridStyleStub();
      allocateStyleId(style);
      styles.set(style.id, style);
      gridStyles.push(style);
      return style;
    }

    createImage(bytes: Uint8Array) {
      const hash = getImageHash();
      return {
        hash,
        getBytesAsync: () => Promise.resolve(bytes)
      };
    }

    // @ts-ignore
    group(nodes: any, parent: any, index) {
      if (joinedConfig.simulateErrors && (!nodes || nodes.length === 0)) {
        throw new Error(
          "Error: First argument must be an array of at least one node"
        );
      }

      const group: any = new GroupNodeStub();
      allocateNodeId(group);
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

    listAvailableFontsAsync(): Promise<Font[]> {
      return Promise.resolve([...Roboto, ...Helvetica]);
    }

    on(
      type: "selectionchange" | "currentpagechange" | "close",
      callback: () => void
    ) {
      if (type === "selectionchange") {
        selectionChangeSubscribes.set(
          callback,
          selectionChangeSubject.subscribe(callback)
        );
      }
      if (type === "currentpagechange") {
        currentPageChangeSubscribes.set(
          callback,
          currentPageChangeSubject.subscribe(callback)
        );
      }
    }

    once(
      type: "selectionchange" | "currentpagechange" | "close",
      callback: () => void
    ) {
      if (type === "selectionchange") {
        selectionChangeSubscribes.set(
          callback,
          selectionChangeSubject.pipe(take(1)).subscribe(callback)
        );
      }
      if (type === "currentpagechange") {
        currentPageChangeSubscribes.set(
          callback,
          currentPageChangeSubject.pipe(take(1)).subscribe(callback)
        );
      }
    }

    off(
      type: "selectionchange" | "currentpagechange" | "close",
      callback: () => void
    ) {
      if (type === "selectionchange") {
        selectionChangeSubscribes.get(callback).unsubscribe();
      }
      if (type === "currentpagechange") {
        currentPageChangeSubscribes.get(callback).unsubscribe();
      }
    }

    getNodeById(id) {
      const _genNodeById = (nodes, id) => {
        for (const node of nodes) {
          if (node.id === id) {
            return node;
          }
          const childMatch = node.children && _genNodeById(node.children, id);
          if (childMatch) {
            return childMatch;
          }
        }
      };
      return _genNodeById([figma.root], id) || null;
    }
  }

  // @ts-ignore
  return new PluginApiStub();
};

export const createParentPostMessage = (
  figma: PluginAPI,
  isWithoutTimeout?: boolean
) => (message: { pluginMessage: any }, target: string) => {
  if (figma.ui.onmessage) {
    const call = () => {
      // @ts-ignore
      figma.ui.onmessage(message.pluginMessage, { origin: null });
    };
    if (isWithoutTimeout) {
      call();
    } else {
      setTimeout(call, 0);
    }
  }
};
