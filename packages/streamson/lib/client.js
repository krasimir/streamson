export default function Streamson(endpoint) {
  const ROOT_ID = "_$0";
  let promises = new Map();
  let data = new Promise((done) => promises.set(ROOT_ID, done));
  let isInFlight = false;

  async function fetchData() {
    try {
      const res = await fetch(endpoint);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      async function process() {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            try {
              const chunk = JSON.parse(decoder.decode(value, { stream: true }));
              chunk.c = walk(chunk.c);
              if (promises.has(chunk.i)) {
                promises.get(chunk.i)(chunk.c);
                promises.delete(chunk.i);
              }
            } catch (e) {
              console.error(`Error parsing chunk.`, e);
            }
          }
        }
      }
      process();
    } catch (e) {
      console.error(e);
      throw new Error(`Failed to fetch data from Streamson endpoint ${endpoint}`);
    }
  }
  function walk(node) {
    if (isPromisePlaceholder(node)) {
      return new Promise((done) => {
        promises.set(node, done);
      });
    }
    if (Array.isArray(node)) {
      return node.map((item) => walk(item));
    }
    if (node && typeof node === "object") {
      const out = {};
      for (const [key, val] of Object.entries(node)) {
        out[key] = walk(val);
      }
      return out;
    }
    return node;
  }
  function isPromisePlaceholder(val) {
    return typeof val === "string" && val.match(/^_\$(\d)/);
  }
  function isPromise(val) {
    return !!val && (typeof val === "object" || typeof val === "function") && typeof val.then === "function";
  }

  return {
    async get(path) {
      if (!isInFlight) {
        isInFlight = true;
        await fetchData(endpoint);
      }
      const parts = (path || "").split(".");
      let current = data;
      let i = 0;
      do {
        if (isPromise(current)) {
          current = await current;
        }
        const key = parts[i];
        if (!key) {
          return current;
        }
        const idx = Number(key);
        if (Number.isInteger(idx) && key === String(idx)) {
          current = current[idx];
        } else {
          current = current[key];
        }
        i++;
      } while (i < parts.length);
      return current;
    }
  };
}
window.Streamson = Streamson;