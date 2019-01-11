const environments = {
  development: 'development',
  production: 'production',
  test: 'test',
};

const getEnv = (variableName, throwOnNonExist = true) => {
  const variable = process.env[variableName];
  if (variable == null && throwOnNonExist) {
    throw new Error(
      `Environment variable ${variableName} does not exist on process.env`,
    );
  }

  return variable;
};

const validEnv =
  getEnv('NODE_ENV') && Object.keys(environments).includes(getEnv('NODE_ENV'));

const env = validEnv ? getEnv('NODE_ENV') : environments.development;

const isDevelopmentEnv = env === environments.development;
const isProductionEnv = env === environments.production;
const isTestEnv = env === environments.test;

const isNotDevelopmentEnv = env !== environments.development;
const isNotProcuctionEnv = env !== environments.production;
const isNotTestEnv = env !== environments.test;

export {
  getEnv,
  validEnv,
  env,
  isDevelopmentEnv,
  isProductionEnv,
  isTestEnv,
  isNotDevelopmentEnv,
  isNotProcuctionEnv,
  isNotTestEnv,
};
