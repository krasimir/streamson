const TIMEOUT = 10000; // 10 seconds

export function serve(res, data) {
  let promises = [];
  let idx = 0;
  const getId = () => `_$${idx++}`;

  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  send(getId(), normalize(data));
  processData();

  function send(id, chunk) {
    res.write(JSON.stringify({ i: id, c: chunk }) + "\n");
  }
  function done(id, value) {
    send(id, value);
    promises = promises.filter((p) => p.id !== id);
    processData();
  }
  function processData() {
    if (promises.length === 0) {
      res.end();
      return;
    }
  }
  function registerPromise(promise, id) {
    let settled = false;
    const timeoutHandle = setTimeout(() => {
      if (settled) return;
      settled = true;
      console.error(`Promise ${id} timed out after ${TIMEOUT}ms`);
      done(id, { error: "timeout", timeoutMs: TIMEOUT });
    }, TIMEOUT);

    promises.push({ promise, id });
    promise.then((value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);
      done(id, value);
    }).catch((err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);
      console.error("Error resolving promise for path", err);
      done(id, { error: "promise error", timeoutMs: TIMEOUT });
    });
  }
  function normalize(value) {
    function walk(node) {
      if (isPromise(node)) {
        const id = getId();
        registerPromise(node, id);
        return id;
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

    return walk(value);
  }
}
function isPromise(val) {
  return !!val && (typeof val === "object" || typeof val === "function") && typeof val.then === "function";
}
