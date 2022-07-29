import proxy from './proxy';
import dotenv from 'dotenv';
dotenv.config();

try {
  proxy.serve();
} catch (error) {
  console.log(error);
}