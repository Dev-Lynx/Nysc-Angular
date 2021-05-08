import {Photo} from './photo';

export class User {
  fileNo: string;
  phoneNumber: string;

  hasPhoneNumber?: boolean;
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
  nextOfKin?: string;
  dateOfBirth?: Date;
  passport?: string;
  signature?: string;
  // passport?: Photo;
  // signature?: Photo;
}
