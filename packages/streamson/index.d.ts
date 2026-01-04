import type { ServerResponse } from "http";

export type StreamsonInstance = {
  get: (path?: string) => Promise<any>;
};

declare function serve(res: ServerResponse, data: any): StreamsonInstance;
