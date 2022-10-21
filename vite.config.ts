import { defineConfig, loadEnv } from 'vite'
import { parseEnv } from './vite/util'
import setupPlugins from './vite/plugins'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  const isBuild = command == 'build'
  const env = parseEnv(loadEnv(mode, process.cwd()))

  return {
    plugins: [...setupPlugins(isBuild, env), vueJsx({}), vue({ reactivityTransform: true })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'types'),
      },
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return id.split('/node_modules/').pop()?.split('/')[0]
            }
          },
        },
      },
    },
    // server: {
    //   host: true,
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_API_URL,
    //       changeOrigin: true,
    //     },
    //     '/captcha/api/math': {
    //       target: env.VITE_API_URL,
    //       changeOrigin: true,
    //     },
    //   },
    // },
    server: { //主要是加上这段代码
      host: '127.0.0.1',
      port: 3001,
      proxy: {
        '/api': {
          target: 'http://121.5.144.14:3000/api/',	//实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    }
  }
})
