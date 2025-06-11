import { defineConfig, loadEnv } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // 导入 Vue 函数，如：ref, reactive, toRef 等
        imports: ["@vueuse/core", "vue", "pinia", "vue-router"],
        // 导入 Element Plus函数，如：ElMessage, ElMessageBox 等
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        // 导入 Element Plus组件，如：ElTable, ElForm 等
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })
}
