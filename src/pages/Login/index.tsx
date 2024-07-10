import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from "@/widgets";
import { loginEmployee } from "@/api";
import { Credentials } from "types/vite-env";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginEmployee(credentials);
      const { status, payload: { employee, token } } = response;
      if (status) {
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed. Please try again.", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-secondary min-h-screen flex items-center justify-center relative px-5">
      {loading && <div className="loader"></div>}
      <div className="bg-white shadow-md rounded-md p-6 w-full ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="sign-text text-black text-2xl font-bold text-center ">Sign In</div>
          <div className="flex-col space-y-2">
            <div className="text-black">Email</div>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </div>
          <div className="flex-col space-y-2">
            <div className="text-black">Password</div>
            <Input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <div className="my-2 text-gray-500 text-sm text-center">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button
            type="submit"
            className="py-2 bg-blue-500 text-white rounded-lg w-full"
            disabled={loading}
          >
            <div className="flex items-center justify-center">
              <span className="me-2">Sign in</span>
              {loading && (
                <span>Loading...</span> 
              )}
            </div>
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
