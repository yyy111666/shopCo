import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    //获取各各环境下对应的变量
    let env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // Specify the icon folder to be cached
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // Specify symbolId format
                symbolId: 'icon-[dir]-[name]'
            }),
            viteMockServe({
                enable: command === 'serve',
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve('./src') // 相对路径别名配置，使用 @ 代替 src
            }
        },
        //scss全局变量
        css: {
            preprocessorOptions: {
                scss: {
                    javascriptEnabled: true,
                    additionalData: '@import "./src/styles/variable.scss";'
                }
            }
        },
        //代理跨域
        server: {
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_SERVE,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            }
        }
    };
});
