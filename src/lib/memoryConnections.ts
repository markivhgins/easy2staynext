// Resilient in-memory store for service connection leads
declare global {
  // eslint-disable-next-line no-var
  var _f2sMemoryConnections: any[] | undefined;
}

if (!global._f2sMemoryConnections) {
  global._f2sMemoryConnections = [];
}

export const memoryConnections = global._f2sMemoryConnections;
