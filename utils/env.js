const environments = {
  development: 'development',
  production: 'production',
  test: 'test',
};

const getEnv = (
  variableName,
  throwOnNonExist = process.env.NODE_ENV !== environments.test,
) => {
  const variable = process.env[variableName];
  if (variable == null && throwOnNonExist) {
    throw new Error(
      `Environment variable ${variableName} does not exist on process.env`,
    );
  }

  /**
   * This replace call might seem odd. But there is something happening to the
   * env variables while being added to the functions. `\n`-chars gets
   * transformed to `\\n`. This becomes especially problematic for PEM-keys
   * which will contain new line chars.
   * @link https://github.com/googleapis/google-api-nodejs-client/issues/1110#issuecomment-436868760
   */
  return typeof variable === 'string'
    ? variable.replace(new RegExp('\\\\n', 'g'), '\n')
    : variable;
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
