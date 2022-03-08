export type TConfig = {
  simulateErrors?: boolean;
  isWithoutTimeout?: boolean;
};

export const defaultConfig: TConfig = {
  simulateErrors: false,
  isWithoutTimeout: false
};

export class Config {
  static joinedConfig: TConfig;
}
