/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the file-tracing root to this repo so a stray lockfile elsewhere on the
  // machine can't be mistaken for the workspace root.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
