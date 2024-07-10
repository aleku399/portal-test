/// <reference types="vite/client" />

// types.ts
export interface EmployeeData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  department?: string;
}
  
  export interface Credentials {
    email: string;
    password: string;
  }
  