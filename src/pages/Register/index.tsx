import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from "@/widgets";
import { registerEmployee } from "@/api";
import { EmployeeData } from "types/vite-env";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EmployeeData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerEmployee(formData);
      console.log('Registration successful:', response);
      const { status, payload: { employee, token } } = response; 
      if (status) {
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration failed. Please try again.', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-secondary px-5">
      <div className=" w-full bg-white shadow-md rounded-md px-2" >
        <h2 className="text-2xl font-bold text-center py-2">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700 py-1">First Name</label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700 py-1">Last Name</label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 py-1">Email</label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 py-1">Password</label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700 py-1">Phone</label>
            <Input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="department" className="text-sm font-medium text-gray-700 py-1">Department</label>
            <Input
              type="text"
              name="department"
              id="department"
              placeholder="Enter your department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit">Register</Button>
          </div>
        </form>
        <div className="py-2 text-center">
          <p>Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
        </div>
        {loading && <div className="text-center mt-4">Loading...</div>}
        {error && <div className="text-red-500 text-center mt-4">Error: {error}</div>}
      </div>
    </div>
  );
};

export default Register;
