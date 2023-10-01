import { prop, getModelForClass } from "@typegoose/typegoose";

//Interfaces
import { UserContact } from "../interfaces/UserContact";

class User {
  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true })
  contacts: UserContact[];
}


const UserModel = getModelForClass(User);
export default UserModel;
