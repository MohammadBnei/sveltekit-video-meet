import { sveltekit } from "@sveltejs/kit/vite";
import type { PluginOption, UserConfig } from "vite";
import WebRTCServer from "./server.ts";

const socketioServer: PluginOption = {
  name: "socketioServer",
  configureServer(server: any) {
    WebRTCServer(server);
  },
};

const config: UserConfig = {
  plugins: [sveltekit(), socketioServer],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
};

export default config;
