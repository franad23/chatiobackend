import { prop, getModelForClass } from "@typegoose/typegoose";

class ContactsNotAccepted {
  @prop({ required: true, unique: true })
  _id: string;

  @prop({ required: true })
  contactsNotAccepted: string[];
}

const ContactsNotAcceptedModel = getModelForClass(ContactsNotAccepted);
export default ContactsNotAcceptedModel;
