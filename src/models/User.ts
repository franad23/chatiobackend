import { prop, getModelForClass } from "@typegoose/typegoose";

class User {
  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true })
  contacts: object[];
}


const UserModel = getModelForClass(User);

export default UserModel;
