import fs from "node:fs";
import express from "express";

import { getBlogPosts } from "./lib/db.js";
// import { serve } from "../../packages/streamson/index.js";
import { serve } from "streamson";

const app = express();
const port = 5009;
const htmlPage = fs.readFileSync('./page.html', 'utf-8');

app.use(express.static('public'));

app.get("/data", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  serve(res, {
    "title": "My Blog",
    "description": "A simple blog example using Streamson",
    "posts": getBlogPosts(),
  })
});
app.get("/", (req, res) => {
  res.send(htmlPage);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
