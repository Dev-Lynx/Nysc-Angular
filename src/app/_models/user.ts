import {Photo} from './photo';

export class User {
  fileNo: string;
  phoneNumber: string;
  phoneNumberConfirmed?: boolean;

  lastName?: string;
  otherNames?: string;
  gender?: string;
  maritalStatus?: string;
  stateOfOrigin?: string;
  stateOfResidence?: string;
  location?: string;
  rank?: string;
  qualification?: string;
  department?: string;
  dateOfBirth?: Date;
  passport?: Photo;
  signature?: Photo;
}
