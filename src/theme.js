// src/theme.js
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e9fbee" },
          100: { value: "#c7eacb" },
          200: { value: "#a3d9a9" },
          300: { value: "#7fc987" },
          400: { value: "#5cb865" },
          500: { value: "#ff0000" },
          600: { value: "#328239" },
          700: { value: "#235e28" },
          800: { value: "#133a16" },
          900: { value: "#001700" },
        },
      },
      fonts: {
        heading: { value: `'Figtree', sans-serif` },
        body: { value: `'Figtree', sans-serif` },
      },
    },
  },
});
