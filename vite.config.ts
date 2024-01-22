import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import copy from "rollup-plugin-copy"
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';



// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		copy({
		targets: [
		  { src: "node_modules/@attrybtech/attryb-ui/lib/public/assets/", dest: "public/attryb-ui" }
		]
	  }),
	  ViteImageOptimizer({
        /* pass your config */
      }),
	],
	build: {
		chunkSizeWarningLimit: 1600,
	},
	resolve: {
		alias: [
		{
		  find: './runtimeConfig',
		  replacement: './runtimeConfig.browser',
		},
	  ]
	}
	
//   server: {
//     port: process.env.REACT_APP_PORT
//   }
})