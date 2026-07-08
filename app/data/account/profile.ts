export interface ProfileFormState {
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
}

export const initialProfile: ProfileFormState = {
  fullName: "Jane Cooper",
  email: "jane.cooper@email.com",
  mobileNumber: "+61 412 345 678",
  dateOfBirth: "1990-04-12",
};
