import React, { FC, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { EmployeeData } from "types/vite-env";
import { registerEmployee, updateEmployee, deleteEmployee } from "@/api";

const EmployeeView: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [isNew, setIsNew] = useState(true);
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (id) {
      setIsNew(false);
    }
  }, [id]);

  useEffect(() => {
    const _employee = location.state?.employee;
    if (_employee) {
      setEmployee(_employee);
    }
  }, [location.state?.employee]);

  const validateEmail = (email: string | undefined): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSave = async () => {
    if (employee) {
      const newFieldErrors: { email?: string; password?: string } = {};

      if (!employee.email || !validateEmail(employee.email)) {
        newFieldErrors.email = "Invalid email address";
      }

      if (!employee.password || !validatePassword(employee.password)) {
        newFieldErrors.password = "Password must be at least 6 characters long";
      }

      if (Object.keys(newFieldErrors).length > 0) {
        setFieldErrors(newFieldErrors);
        return;
      }

      setLoading(true);
      try {
        let data;
        if (isNew) {
          const response = await registerEmployee(employee);
          if (response.status) {
            data = response.payload.employee;
          } else {
            throw new Error("Failed to register employee");
          }
        } else if (employee.id !== undefined) {
          const response = await updateEmployee(employee.id, employee);
          if (response.status) {
            data = response.payload;
          } else {
            throw new Error("Failed to update employee");
          }
        }
        navigate(`/employee/${data.id}`, { state: { employee: data } });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (employee && !isNew && employee.id !== undefined) {
      setLoading(true);
      try {
        await deleteEmployee(employee.id);
        navigate('/home');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-light-secondary p-6">
      <nav className="mb-4">
        <ol className="list-reset flex text-gray-500">
          <li>
            <button onClick={() => navigate('/home')} className="text-blue-600">Employees</button>
          </li>
          <li><span className="mx-2">{">"}</span></li>
          <li className="">{isNew ? "New Employee" : `${employee?.firstName} ${employee?.lastName}`}</li>
        </ol>
      </nav>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">{isNew ? "Create New Employee" : "Edit Employee"}</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.firstName || ""}
              onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.lastName || ""}
              onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.email || ""}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.password || ""}
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
              onFocus={togglePasswordVisibility}
            />
            {fieldErrors.password && <p className="text-red-500 text-xs">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.department || ""}
              onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              value={employee?.phone || ""}
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            {!isNew && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeView;
