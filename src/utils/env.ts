const environments = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const;

export function getEnv(variableName: string) {
  const variable = process.env[variableName];
  if (variable == null) {
    throw new Error(`Environment variable ${variableName} does not exist on process.env`);
  }

  /**
   * This replace call might seem odd. But there is something happening to the
   * env variables while being added to the functions. `\n`-chars gets
   * transformed to `\\n`. This becomes especially problematic for PEM-keys
   * which will contain new line chars.
   * @link https://github.com/googleapis/google-api-nodejs-client/issues/1110#issuecomment-436868760
   */
  return typeof variable === 'string' ? variable.replace(new RegExp('\\\\n', 'g'), '\n') : variable;
}

export const env = (getEnv('NODE_ENV') as keyof typeof environments) ?? environments.development;
