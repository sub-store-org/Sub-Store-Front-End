import vue from "@vitejs/plugin-vue";
import * as path from "path";
import fs from "fs";
import { ConfigEnv, defineConfig, loadEnv } from "vite";
import { createStyleImportPlugin } from "vite-plugin-style-import";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")).version.trim();

const alias: Record<string, string> = {
  "@": path.resolve(__dirname, "src"),
  vue: "vue/dist/vue.esm-bundler.js",
};

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html: string) {
      return html.replace(/__SUB_STORE_FRONT_END_VERSION__/g, version);
    },
  };
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());

  return {
    plugins: [
      htmlPlugin(),
      vue(),
      createStyleImportPlugin({
        // resolves: [NutuiResolve()],
        libs: [
          {
            libraryName: "@nutui/nutui",
            esModule: true,
            resolveStyle: (name) => {
              name = name.toLowerCase().replace("-", ""); // NutuiResolve官方版目前在linux会造成大小写不一致问题无法加载资源
              if (name === "icon") {
                return "";
              }
              return `@nutui/nutui/dist/packages/${name}/index.scss`;
            },
          },
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
        customDomId: "__svg__icons__dom__",
      }),
      viteCompression({
        // verbose: true,
        // disable: false,
        threshold: 10240,
        // algorithm: 'gzip',
        // ext: '.gz'
      }),
      VitePWA({
        srcDir: "src",
        outDir: "dist",
        strategies: "generateSW",
        registerType: "prompt",
        // minify: true,
        // includeAssets: ['favicon.svg'],
        manifest: {
          name: "Sub-Store",
          short_name: "Sub-Store",
          description: "A sub-converter running in a Progressive Web App",
          id: "/",
          start_url: "/",
          scope: "/",
          lang: "en",
          display: "standalone",
          icons: [
            {
              src: "144x144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "168x168.png",
              sizes: "168x168",
              type: "image/png",
            },
            {
              src: "192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "256x256.png",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "maskable-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,json}"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/(^|\/.+)\/(api|download|share)\/.+/],
          runtimeCaching: [
            {
              urlPattern: ({ url, request }) => request.destination === "script" && url.origin === self.location.origin,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "js-cache",
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "style" || request.destination === "image" || request.destination === "font",
              handler: "CacheFirst",
              options: {
                cacheName: "asset-cache",
              },
            },
          ],
        },
        selfDestroying: false,
      }),
    ],
    root: process.cwd(),
    resolve: { alias },
    optimizeDeps: {
      include: ["@codemirror/lang-yaml"],
    },
    base: mode.command === "serve" ? "./" : env.VITE_PUBLIC_PATH,
    hmr: true,
    server: {
      port: env.VITE_PORT as unknown as number,
      open: env.VITE_OPEN,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      assetsInlineLimit: 2048,
      chunkSizeWarningLimit: 2048,
      target: "es2015",
      minify: "terser",
      input: {
        main: "src/main.ts",
        SplashScreen: "src/SplashScreen.vue",
      },
      rollupOptions: {
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name?.split(".").pop()?.toLowerCase() ?? "";
            if (/^(png|jpe?g|svg|webp|avif|gif|ico)$/.test(ext)) return "images/[name].[ext]";
            if (/^(woff2?|ttf|eot|otf)$/.test(ext)) return "fonts/[name].[ext]";
            if (ext === "css") return "css/[name].[ext]";
            return "[name].[ext]";
          },
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@nutui/nutui") || (id.includes("@nutui") && !id.includes("@nutui/icons"))) return "nutui";
              if (id.includes("/codemirror/") || id.includes("@codemirror/") || id.includes("@lezer/") || id.includes("@replit/codemirror") || id.includes("js-beautify")) return "editor";
              if (id.includes("vue-i18n") || id.includes("@intlify/")) return "i18n";
              if (id.includes("@fortawesome/")) return "icons";
              if (id.includes("@vuepic/vue-datepicker")) return "datepicker";
              if (id.includes("/vue/") || id.includes("/vue-router/") || id.includes("/pinia/") || id.includes("@vue/") || id.includes("@vueuse/")) return "vue-vendor";
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 自定义覆盖主题 和 nutui 全局 scss 变量
          additionalData: `@import "@/assets/styles/custom_variables.scss";@import "@nutui/nutui/dist/styles/variables-jdt.scss";@import '@/assets/styles/mixins.scss';`,
          // NutUI 3 和 Vite 3 仍依赖 Sass 已弃用的 API。
          silenceDeprecations: ["import", "legacy-js-api"],
        },
      },
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      "import.meta.env.PACKAGE_VERSION": JSON.stringify(version),
    },
  };
});

export default viteConfig;
