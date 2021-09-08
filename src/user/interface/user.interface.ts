import * as mongoose from 'mongoose';

export interface Follow extends mongoose.Document {
  _id: string;
  name: string;
}

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  follow?: Array<Follow>;
}
