import {applyMixins} from "./applyMixins";

export class Children {
    children: Array<any>;
    appendChild(item) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(item);
    }
}

class Base {
    private pluginData: { [key: string]: string };

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
}

class Rectangle1 {
    type = 'RECTANGLE';

    resize() {}
}

applyMixins(Rectangle1, [Base]);
