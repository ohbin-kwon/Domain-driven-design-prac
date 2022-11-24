import path from "path";
import dotenv from "dotenv";
import { ENV_PATH } from "../const";
dotenv.config({ path: path.resolve(__dirname, ENV_PATH) });

interface ENV {
  NODE_ENV: string | undefined;
  POSTGRES_DB_NAME: string | undefined;
  POSTGRES_USER_NAME: string | undefined;
  POSTGRES_PASSWORD: string | undefined;
  POSTGRES_PORT: number | undefined;
  DOCKER_POSTGRES_PASSWORD: string | undefined;
  DOCKER_POSTGRES_USER: string | undefined;
  DOCKER_PORT: number | undefined;
}

interface Config {
  NODE_ENV: string;
  POSTGRES_DB_NAME: string;
  POSTGRES_USER_NAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: number;
  DOCKER_POSTGRES_PASSWORD: string;
  DOCKER_POSTGRES_USER: string;
  DOCKER_PORT: number;
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
    POSTGRES_USER_NAME: process.env.POSTGRES_USER_NAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_PORT: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : undefined,
    DOCKER_POSTGRES_PASSWORD: process.env.DOCKER_POSTGRES_PASSWORD,
    DOCKER_POSTGRES_USER: process.env.DOCKER_POSTGRES_USER,
    DOCKER_PORT: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : undefined,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;