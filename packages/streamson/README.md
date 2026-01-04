![Streamson Logo](https://github.com/krasimir/streamson/raw/main/assets/streamson.jpg)

# Streamson

A minimalistic dependency-free JSON streaming server (<100loc) and client (1KB).

## Installation

To get the server bit:

```bash
> npm install streamson
```

The client:

https://unpkg.com/streamson@latest/dist/streamson.min.js (~1KB)

## Usage

### Server

```js
import { serve } from "streamson";
import express from "express";

const app = express();
const port = 5009;

app.get("/data", async (req, res) => {
  const myData = {
    title: "My Blog",
    description: "A simple blog example using Streamson",
    posts: getBlogPosts(), // this returns a Promise
  }
  serve(res, myData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

`getBlogPosts` is a function that returns a Promise resolving to an array of blog posts. Of course inside you may have more nested Promises. Like for example each blog post may have comments that are fetched asynchronously:

```js
function getBlogPosts() {
  return Promise.resolve([
    {
      title: "First Post",
      content: "This is my first post",
      comments: fetchCommentsForPost(1), // returns a Promise
    },
    {
      title: "Second Post",
      content: "This is my second post",
      comments: fetchCommentsForPost(2), // returns a Promise
    },
  ]);
}
```

Streamson will gradually stream the JSON to the client as the Promises get resolved.

### Client

```javascript
const request = Streamson("/data");

const data = await request.get();
console.log(data.title); // "My Blog"

const posts = await request.get('posts');
console.log(posts); // Array of blog posts
```

`Streamson` is a global variable available when you include the client script. Notice that the `get` method can take an optional path argument so you can await on a specific part of the JSON structure. For example `request.get()` does not wait for the `posts` to be loaded, but `request.get('posts')` does. If you don't wait for a specific part, on its place you will get a promise.