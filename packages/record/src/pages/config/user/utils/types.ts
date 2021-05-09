import { RouteComponentProps, WindowLocation } from '@reach/router';
import { User } from 'types/user';

export interface Props extends RouteComponentProps {
  location?: WindowLocation<{
    user: User;
    updatePassword?: boolean
  }>;
}

export interface FormData {
  email: string;
  username: string;
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
