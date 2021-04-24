import { Handler } from '../types';

interface Data {
  value: string;
}

const test: Handler<Data> = (data) => {
  console.log(data);
};

export default test;
