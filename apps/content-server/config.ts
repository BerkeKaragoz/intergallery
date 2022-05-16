import { existsSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

const getEnvs = (envs: string[]) => {
  const cwd = process.cwd();
  return [
    ".env.local",
    ...envs.map((env) => `.env.${env}.local`),
    ".env",
    ...envs.map((env) => `.env.${env}`),
  ]
    .map((fileName) => resolve(cwd, fileName))
    .filter((filePath) => existsSync(filePath))
    .reduce((settings, path) => {
      const foundSettings = dotenv.config({ path });
      if (foundSettings.error) throw foundSettings.error;
      return { ...settings, ...foundSettings.parsed };
    }, {});
};

getEnvs([]);
