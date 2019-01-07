const path = require('path');

const project = process.env.PROJECT;

if (!project) {
  throw new Error(
    'Define a project thru env variable PROJECT in order to build',
  );
}

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [`./services/${project}/index.js`];
    config.output.path = path.join(process.cwd(), 'build', project);
    config.externals = undefined;
    config.plugins = config.plugins.filter(
      p => p.constructor !== webpack.BannerPlugin,
    );

    return config;
  },
};
