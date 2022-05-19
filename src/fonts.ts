export const Inter: Font[] = [
  {
    fontName: {
      family: "Inter",
      style: "Thin"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Extra Light"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Light"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Regular"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Medium"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Semi Bold"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Bold"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Extra Bold"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Black"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Thin Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Extra Light Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Light Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Regular Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Medium Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Semi Bold Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Bold Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Extra Bold Italic"
    }
  },
  {
    fontName: {
      family: "Inter",
      style: "Black Italic"
    }
  }
];

export const Roboto: Font[] = [
  {
    fontName: {
      family: "Roboto",
      style: "Thin"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Light"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Regular"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Medium"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Bold"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Black"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Thin Italic"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Light Italic"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Regular Italic"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Medium Italic"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Bold Italic"
    }
  },
  {
    fontName: {
      family: "Roboto",
      style: "Black Italic"
    }
  }
];

export const Helvetica: Font[] = [
  {
    fontName: {
      family: "Helvetica",
      style: "Light"
    }
  },
  {
    fontName: {
      family: "Helvetica",
      style: "Regular"
    }
  },
  {
    fontName: {
      family: "Helvetica",
      style: "Bold"
    }
  },
  {
    fontName: {
      family: "Helvetica",
      style: "Light Oblique"
    }
  },
  {
    fontName: {
      family: "Helvetica",
      style: "Oblique"
    }
  },
  {
    fontName: {
      family: "Helvetica",
      style: "Oblique"
    }
  }
];

export class Fonts {
  static loadedFonts: Array<FontName> = [];

  static isFontLoaded(fontName) {
    return this.loadedFonts.find(
      font => font.family === fontName.family && font.style === fontName.style
    );
  }
}
