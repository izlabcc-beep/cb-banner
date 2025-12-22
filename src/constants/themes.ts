export type ThemeId = 'white' | 'blue' | 'black';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  backgroundStart: string;
  backgroundEnd: string;
  titleColor: string;
  subtitleColor: string;
  subtitleBackgroundColor: string;
  subtitleColorOnBackground: string;
  titleColorOnSubtitleBackground: string; // New field for title color when subtitle background is active
  promptTemplate?: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  white: {
    id: 'white',
    name: 'Белый',
    backgroundStart: '#E8E8E8',
    backgroundEnd: '#FFFFFF',
    titleColor: '#000000',
    subtitleColor: '#0065FF',
    subtitleBackgroundColor: '#0065FF',
    subtitleColorOnBackground: '#FFFFFF',
    titleColorOnSubtitleBackground: '#FFFFFF',
    promptTemplate: `{
  "object": {
    "description": "@PROMT@",
    "style_hint": "simple iconic shape, rounded, premium"
  },

  "palette": {
    "metal_base": "#0166FE",
    "accent_primary": "#BFFF44",
    "accent_secondary": "#DADDE2",

    "light_key": "#B0D1FF",
    "light_fill": "#F5F7FA",
    "light_rim": "#E5FFB4",

    "background": "#FFFFFF",
    "shadow": "#000000"
  },

  "style": {
    "render_type": "3D premium icon",
    "aesthetic": "apple-like, emoji-style, modern product render",

    "materials": {
      "metal": "anodized satin metal, smooth, slightly glossy",
      "accent": "polished enamel or plastic",
      "detail": "frosted glass or enamel inset"
    },

    "lighting": {
      "setup": "studio soft light",
      "key_intensity": 1.2,
      "fill_intensity": 0.6,
      "rim_intensity": 0.8
    },

    "camera": {
      "projection": "perspective",
      "focal_length_mm": 70,
      "rotation": { "x": -15, "y": 25, "z": 0 }
    },

    "background": {
      "type": "solid",
      "shadow": "soft contact shadow, low opacity"
    },

    "quality": {
      "detail_level": "high",
      "edges": "soft beveled",
      "noise": "none",
      "text": "none"
    }
  },

  "constraints": {
    "color_policy": "STRICT",
    "allowed_colors_source": "palette",
    "disallow_new_colors": true,
    "disallow_gradients_outside_palette": true,
    "target": "1:1",
    "tolerance": "±10%",
    "composition": "square, centered",
    "object_scaling": "fit within square frame",
    "disallow_vertical_or_horizontal_stretch": true
  },

  "negative_prompt": [
    "introducing any colors not defined in the palette block",
    "unexpected color tints or hue shifts",
    "random gradients or rainbow effects",
    "textures, noise, grain, scratches",
    "flat 2D illustration",
    "photorealism or real-world scenes",
    "text, letters, numbers, logos",
    "busy background or additional objects",
    "hard shadows or dramatic contrast",
    "sharp edges or unrounded geometry",
    "low resolution, blur, artifacts"
  ]
}`
  },
  blue: {
    id: 'blue',
    name: 'Синий',
    backgroundStart: '#0065FF',
    backgroundEnd: '#61A4FF',
    titleColor: '#FFFFFF',
    subtitleColor: '#BFFF44',
    subtitleBackgroundColor: '#BFFF44',
    subtitleColorOnBackground: '#000000',
    titleColorOnSubtitleBackground: '#000000',
    promptTemplate: `{
  "object": {
    "description": "@PROMT@",
    "style_hint": "simple iconic shape, rounded, premium"
  },

  "palette": {
    "metal_base": "#DADDE2",
    "accent_primary": "#0166FE",
    "accent_secondary": "#BFFF44",

    "light_key": "#B0D1FF",
    "light_fill": "#F5F7FA",
    "light_rim": "#E5FFB4",

    "background": "#FFFFFF",
    "shadow": "#000000"
  },

  "style": {
    "render_type": "3D premium icon",
    "aesthetic": "apple-like, emoji-style, modern product render",

    "materials": {
      "metal": "anodized satin metal, smooth, slightly glossy",
      "accent": "polished enamel or plastic",
      "detail": "frosted glass or enamel inset"
    },

    "lighting": {
      "setup": "studio soft light",
      "key_intensity": 1.2,
      "fill_intensity": 0.6,
      "rim_intensity": 0.8
    },

    "camera": {
      "projection": "perspective",
      "focal_length_mm": 70,
      "rotation": { "x": -15, "y": 25, "z": 0 }
    },

    "background": {
      "type": "solid",
      "shadow": "soft contact shadow, low opacity"
    },

    "quality": {
      "detail_level": "high",
      "edges": "soft beveled",
      "noise": "none",
      "text": "none"
    }
  },

  "constraints": {
    "color_policy": "STRICT",
    "allowed_colors_source": "palette",
    "disallow_new_colors": true,
    "disallow_gradients_outside_palette": true,
    "target": "1:1",
    "tolerance": "±10%",
    "composition": "square, centered",
    "object_scaling": "fit within square frame",
    "disallow_vertical_or_horizontal_stretch": true
  },

  "negative_prompt": [
    "introducing any colors not defined in the palette block",
    "unexpected color tints or hue shifts",
    "random gradients or rainbow effects",
    "textures, noise, grain, scratches",
    "flat 2D illustration",
    "photorealism or real-world scenes",
    "text, letters, numbers, logos",
    "busy background or additional objects",
    "hard shadows or dramatic contrast",
    "sharp edges or unrounded geometry",
    "low resolution, blur, artifacts"
  ]
}`
  },
  black: {
    id: 'black',
    name: 'Черный',
    backgroundStart: '#010205',
    backgroundEnd: '#433100',
    titleColor: '#FFFFFF',
    subtitleColor: '#E0A500',
    subtitleBackgroundColor: '#E0A500',
    subtitleColorOnBackground: '#000000',
    titleColorOnSubtitleBackground: '#000000',
    promptTemplate: `{
  "object": {
    "description": "@PROMT@",
    "style_hint": "simple iconic shape, rounded, premium"
  },

  "palette": {
    "metal_base": "#251C02",
    "accent_primary": "#E0A500",
    "accent_secondary": "#DADDE2",

    "light_key": "#423101",
    "light_fill": "#F5F7FA",
    "light_rim": "#E0A500",

    "background": "#000000",
    "shadow": "#000000"
  },

  "style": {
    "render_type": "3D premium icon",
    "aesthetic": "apple-like, emoji-style, modern product render",

    "materials": {
      "metal": "anodized satin metal, smooth, slightly glossy",
      "accent": "polished enamel or plastic",
      "detail": "frosted glass or enamel inset"
    },

    "lighting": {
      "setup": "studio soft light",
      "key_intensity": 1.2,
      "fill_intensity": 0.6,
      "rim_intensity": 0.8
    },

    "camera": {
      "projection": "perspective",
      "focal_length_mm": 70,
      "rotation": { "x": -15, "y": 25, "z": 0 }
    },

    "background": {
      "type": "solid",
      "shadow": "soft contact shadow, low opacity"
    },

    "quality": {
      "detail_level": "high",
      "edges": "soft beveled",
      "noise": "none",
      "text": "none"
    }
  },

  "constraints": {
    "color_policy": "STRICT",
    "allowed_colors_source": "palette",
    "disallow_new_colors": true,
    "disallow_gradients_outside_palette": true,
    "target": "1:1",
    "tolerance": "±10%",
    "composition": "square, centered",
    "object_scaling": "fit within square frame",
    "disallow_vertical_or_horizontal_stretch": true
  },

  "negative_prompt": [
    "introducing any colors not defined in the palette block",
    "unexpected color tints or hue shifts",
    "random gradients or rainbow effects",
    "textures, noise, grain, scratches",
    "flat 2D illustration",
    "photorealism or real-world scenes",
    "text, letters, numbers, logos",
    "busy background or additional objects",
    "hard shadows or dramatic contrast",
    "sharp edges or unrounded geometry",
    "low resolution, blur, artifacts"
  ]
}`
  },
};
