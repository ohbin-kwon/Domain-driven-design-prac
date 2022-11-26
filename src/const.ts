export const ENV_PATH =
  process.env.NODE_ENV === 'production'
    ? `../../config/.env.${process.env.NODE_ENV}`
    : `../config/.env.${process.env.NODE_ENV}`;
