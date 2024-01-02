/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  tailwind: true,
  postcss: true,
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: [
    /@floating-ui\/.+/,
    /@mui\/.+/,
    /@popperjs\/.+/,
    /@react-spring\/.+/,
    /clsx/,
    /d3-.+/,
    /internmap/,
    /prop-types/,
    /@babel\/.+/
  ]
};
