# Figma API Stub

[![npm version](https://img.shields.io/npm/v/figma-api-stub.svg)](https://www.npmjs.com/package/figma-api-stub)

Stub implementation of [Figma Plugins API](https://www.figma.com/plugin-docs/intro/).

```javascript
import {createFigma} from "figma-api-stub";

const figma = createFigma();
const rect = figma.createRectangle();
rect.resize(100, 200);
```

## Installation

Install it with yarn:

```
yarn add figma-api-stub
```

Or with npm:

```
npm i figma-api-stub --save
```

## API

#### Stub api creation

```javascript
createFigma(): PluginAPI
```
