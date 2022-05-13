import { join } from 'path';

export default () => ({
  SERVING_PATH: process.env.SERVING_PATH || join(__dirname, '../public'),
});
