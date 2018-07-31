const sass = require("@stencil/sass");

exports.config = {
  namespace: 'warp10-download',
  plugins: [sass()],
  enableCache: true,
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ]
};
