import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

const alias: Record<string, string> = {
  '@': path.resolve(__dirname, 'src'),
  vue: 'vue/dist/vue.esm-bundler.js',
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());

  return {
    plugins: [
      vue(),
      createStyleImportPlugin({
        // resolves: [NutuiResolve()],
        libs: [
          {
            libraryName: '@nutui/nutui',
            esModule: true,
            resolveStyle: name => {
              name = name.toLowerCase().replace('-', ''); // NutuiResolve官方版目前在linux会造成大小写不一致问题无法加载资源
              if (name === 'icon') {
                return '';
              }
              return `@nutui/nutui/dist/packages/${name}/index.scss`;
            },
          },
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__',
      }),
      viteCompression({
        // verbose: true,
        // disable: false,
        threshold: 10240,
        // algorithm: 'gzip',
        // ext: '.gz'
      }),
      VitePWA({
        srcDir: 'src',
        outDir: 'dist',
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        // minify: true,
        // includeAssets: ['favicon.svg'],
        manifest: {
          name: 'Sub Store',
          short_name: 'Sub Store',
          description: 'A sub-converter running in a Progressive Web App',
          theme_color: '#121212',
          background_color: '#121212',
          id: '/',
          start_url: '/',
          scope: '/',
          lang: 'en',
          display: 'standalone',
          icons: [
            {
              src: '144x144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: '168x168.png',
              sizes: '168x168',
              type: 'image/png',
            },
            {
              src: '192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
            {
              src: '512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          // globPatterns: ['**/*.{css,js,gz,eot,html,svg,png,ico,ttf,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /.*\.(?:js|css|gz|html|json)/i, // json
              handler: 'CacheFirst',
              options: {
                cacheName: 'sub-store-js-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            {
              urlPattern: /.*\.(?:png|svg|ico|woff|ttf|eot)/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'sub-store-res-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
          ],
        },
        selfDestroying: false,
      }),
    ],
    root: process.cwd(),
    resolve: { alias },
    base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
    hmr: true,
    server: {
      port: env.VITE_PORT as unknown as number,
      open: env.VITE_OPEN,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      target: 'es2015',
      minify: 'terser',
      input: {
        main: 'src/main.ts',
        SplashScreen: 'src/SplashScreen.vue',
      },
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
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
          additionalData: `@import "@/assets/styles/custom_variables.scss";@import "@nutui/nutui/dist/styles/variables-jdt.scss";`,
        },
      },
    },
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
  };
});

export default viteConfig;
