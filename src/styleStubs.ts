import { TConfig } from "./config";

type StyleBasics = {
  styles: Map<string, BaseStyle>;
  paintStyles: any[];
  effectStyles: any[];
  textStyles: any[];
  gridStyles: any[];
};

export const getBaseStyleStub = (config: TConfig) =>
  class BaseStyleStub implements BaseStyle {
    constructor(public styleBasics: StyleBasics) {}

    id: string;
    type: StyleType;
    name: string;
    description: string;
    remote: boolean = false;
    key: string;
    documentationLinks: readonly DocumentationLink[];
    removed: boolean;
    consumers: StyleConsumers[];

    relaunchData: { [command: string]: string };
    pluginData: { [key: string]: string };
    sharedPluginData: { [namespace: string]: { [key: string]: string } };

    setPluginData(key: string, value: string) {
      if (!this.pluginData) {
        this.pluginData = {};
      }
      this.pluginData[key] = value;
    }

    getPluginData(key: string) {
      if (config.simulateErrors && this.removed) {
        throw new Error(`The style with id ${this.id} does not exist`);
      }
      if (!this.pluginData) {
        return;
      }
      return this.pluginData[key];
    }

    getPluginDataKeys(): string[] {
      if (config.simulateErrors && this.removed) {
        throw new Error(`The style with id ${this.id} does not exist`);
      }
      if (!this.pluginData) {
        return [];
      }
      return Object.keys(this.pluginData);
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

    getSharedPluginDataKeys(namespace: string): string[] {
      if (!this.sharedPluginData || !this.sharedPluginData[namespace]) {
        return;
      }
      return Object.keys(this.sharedPluginData[namespace]);
    }

    remove(): void {
      this.removed = true;
      this.styleBasics.styles.delete(this.id);
    }

    async getPublishStatusAsync(): Promise<PublishStatus> {
      return await "UNPUBLISHED";
    }
  };

export const getPaintStyleStub = (config: TConfig) => {
  const BaseStyleStub = getBaseStyleStub(config);

  return class PaintStyleStub extends BaseStyleStub implements PaintStyle {
    constructor(styleBasics: StyleBasics) {
      super(styleBasics);
    }

    // @ts-ignore
    type = "PAINT" as StyleType;
    paints: readonly Paint[];

    remove() {
      super.remove();
      this.styleBasics.paintStyles.splice(
        this.styleBasics.paintStyles.indexOf(this),
        1
      );
    }
  };
};

export const getEffectStyleStub = (config: TConfig) => {
  const BaseStyleStub = getBaseStyleStub(config);

  return class EffectStyleStub extends BaseStyleStub implements EffectStyle {
    constructor(styleBasics: StyleBasics) {
      super(styleBasics);
    }
    // @ts-ignore
    type = "EFFECT" as StyleType;
    effects: readonly Effect[];

    remove() {
      super.remove();
      this.styleBasics.effectStyles.splice(
        this.styleBasics.effectStyles.indexOf(this),
        1
      );
    }
  };
};
export const getTextStyleStub = (config: TConfig) => {
  const BaseStyleStub = getBaseStyleStub(config);

  return class TextStyleStub extends BaseStyleStub implements TextStyle {
    constructor(styleBasics: StyleBasics) {
      super(styleBasics);
    }
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
      this.styleBasics.textStyles.splice(
        this.styleBasics.textStyles.indexOf(this),
        1
      );
    }
  };
};

export const getGridStyleStub = (config: TConfig) => {
  const BaseStyleStub = getBaseStyleStub(config);

  return class GridStyleStub extends BaseStyleStub implements GridStyle {
    constructor(styleBasics: StyleBasics) {
      super(styleBasics);
    }
    // @ts-ignore
    type = "GRID" as StyleType;
    layoutGrids: readonly LayoutGrid[];

    remove() {
      super.remove();
      this.styleBasics.gridStyles.splice(
        this.styleBasics.gridStyles.indexOf(this),
        1
      );
    }
  };
};
