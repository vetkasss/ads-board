export interface SettingsForm {
  userData: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  };
  passwordData: {
    currentPassword: string;
    newPassword: string;
  };
}

export const initialSettingsForm: SettingsForm = {
  userData: {
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  },
  passwordData: {
    currentPassword: '',
    newPassword: ''
  }
};
export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}