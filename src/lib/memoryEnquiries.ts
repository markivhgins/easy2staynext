// Resilient in-memory store for visit and callback enquiries
declare global {
  // eslint-disable-next-line no-var
  var _f2sMemoryEnquiries: any[] | undefined;
}

if (!global._f2sMemoryEnquiries) {
  global._f2sMemoryEnquiries = [];
}

export const memoryEnquiries = global._f2sMemoryEnquiries;
