import * as path from 'path';

export const envFilePath = path.resolve(`.env.${process.env.NODE_ENV || 'development'}`);
