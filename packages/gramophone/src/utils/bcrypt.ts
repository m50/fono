import bcryptLib from 'bcrypt';

export const bcrypt = (str: string, saltRounds: number = 10): Promise<string> => bcryptLib.hash(str, saltRounds);
export const check = (str: string, hash: string): Promise<boolean> => bcryptLib.compare(str, hash);
