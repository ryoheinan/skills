import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    "*.{js,ts,tsx,md}": "vp check --fix",
  },
});
