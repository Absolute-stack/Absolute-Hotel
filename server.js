import fs from "fs";
import path from "path";
import express from "express";
import { Transform } from "stream";
import { fileURLToPath } from "url";
import { render } from "./dist/entry-server.js";
import { renderToPipeableStream } from "react-dom/server";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const template = fs.readFileSync("./dist/index.html", "utf-8");
const [head, tail] = template.split("<!--ssr-outlet-->");

app.use("/assets", express.static(path.resolve(__dirname, "./dist/assets")));

app.get("*", async (req, res) => {
  const { tree, dehydratedState } = await render(req.url);

  const { pipe } = renderToPipeableStream(tree, {
    onShellReady() {
      res.status(200);
      res.setHeader("Content-Type", "text/html");
      const stateHead = head.replace(
        "</head>",
        `<script>window.__REACT_QUERY_STATE = ${JSON.stringify(dehydratedState)}</script></head>`,
      );
      res.write(stateHead);
      const appendTail = new Transform({
        transform(chunk, en, callback) {
          callback(null, chunk);
        },
        flush(callback) {
          this.push(tail);
          callback();
        },
      });
      pipe(appendTail);
      appendTail.pipe(res);
    },

    onError(err) {
      console.log(err);
    },
  });
});

app.listen(9000, () => console.log(`SSR is running on PORT 9000`));
