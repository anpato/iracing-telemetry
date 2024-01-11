/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  tailwind: true,
  postcss: true,
  serverModuleFormat: 'cjs',
  browserNodeBuiltinsPolyfill: {
    modules: {
      path: true,
      fs: true
    }
  }
};
