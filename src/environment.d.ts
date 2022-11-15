export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_DB_NAME: string;
      POSTGRES_USER_NAME: string;
      POSTGRES_PASSWORD: string
      POSTGRES_PORT: number;
      DOCKER_POSTGRES_PASSWORD: string
      DOCKER_POSTGRES_USER: string
      DOCKER_PORT: number
    }
  }
}