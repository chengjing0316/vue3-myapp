import { defineConfig, UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(
  ({ command, mode }: ConfigEnv): UserConfigExport => {
    //获取各种环境下的对应的变量
    let env = loadEnv(mode, process.cwd())
    return {
      // base:'./',
      //代理跨域
      server: {
        proxy: {
          [env.VITE_APP_BASE_API]: {
            //获取数据的服务器地址设置
            target: env.VITE_SERVE,
            //需要代理跨域
            changeOrigin: true,
            //路径重写
            rewrite: (path) => path.replace(/^\/api/, '')
          }
          // '/api': 'http://127.0.0.1:8080'
        }
      },
      resolve: {
        alias: {
          '@': path.resolve('./src')
        }
      },
      plugins: [
        vue(),
        createSvgIconsPlugin({
          iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
          symbolId: 'icon-[dir]-[name]'
        }),
        viteMockServe({
          localEnabled: command === 'serve' //保证开发阶段能使用接口
        })
      ],
      //scss全局变量的配置
      css: {
        preprocessorOptions: {
          scss: {
            javascriptEnabled: true,
            additionalData: '@import "./src/styles/variable.scss";'
          }
        }
      }
    }
  }
)
