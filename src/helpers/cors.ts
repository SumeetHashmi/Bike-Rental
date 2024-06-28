import cors from 'cors';

const allowedOrigins = ['*'];

export const internalOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};
