import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const minify = true;

(async function () {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "lib", "client.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "dist", "streamson.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: []
  });
})();
