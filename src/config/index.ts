import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { BaseError } from '../error';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvVarsSchema {
  NODE_ENV: 'prod' | 'dev' | 'test';
}

const envVarsSchema = Joi.object<EnvVarsSchema>()
  .keys({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'test').required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (!envVars || error) {
  throw new BaseError(400, `Config validation error: ${error.message}`);
}

const config = envVars;

export default config;
