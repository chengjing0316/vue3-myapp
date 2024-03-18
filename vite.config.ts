import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command }: ConfigEnv): UserConfigExport => {
  return {
    // server: {
    //   host: 'localhost',
    //   port: 8080,
    //   proxy: {
    //     '/api': 'http://127.0.0.1:8080'

    //   }
    // },
    resolve: {
      alias: {
        '@': path.resolve("./src")
      }
    },
    plugins: [vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    viteMockServe({
      localEnabled: command === 'serve', //保证开发阶段能使用接口
    }),
    ],
    //scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  }
}
)

