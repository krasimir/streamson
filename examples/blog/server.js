import { getBlogPosts } from "./lib/db.js";
import express from "express";
import { serve } from "../../packages/streamson/index.js";

const app = express();
const port = 5009;

app.use(express.static('public'));

app.get("/data", async (req, res) => {
  serve(res, {
    "title": "My Blog",
    "description": "A simple blog example using Streamson",
    "posts": getBlogPosts(),
  })
});
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
</head>
<body>
    <h1>Welcome to My Blog</h1>
    <div id="content">Loading...</div>
    <script src="/client.js" defer></script>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
