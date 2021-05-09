import { DateTime } from 'luxon';

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}
