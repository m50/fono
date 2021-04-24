import { Handler } from '../types';

interface Data {
  message: string;
  data: any;
}

const broadcast: Handler<Data> = (containerData, socket) => {
  const { message, data } = containerData;
  socket.broadcast(message, data);
};

export default broadcast;
