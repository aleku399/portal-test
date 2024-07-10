import axios from "axios";
import { Credentials, EmployeeData } from "types/vite-env";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerEmployee = async (employeeData: EmployeeData) => {
  try {
    const response = await instance.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    console.error('Error in registerEmployee:', error);
    throw error;
  }
};

export const loginEmployee = async (credentials: Credentials) => {
  try {
    const response = await instance.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error in loginEmployee:', error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await instance.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error in fetchEmployees:', error);
    throw error;
  }
};

export const fetchEmployee = async (id: number) => {
  try {
    const response = await instance.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in fetchEmployee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: number, employeeData: EmployeeData) => {
  try {
    const response = await instance.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: number) => {
  try {
    const response = await instance.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    throw error;
  }
};

export default instance;
