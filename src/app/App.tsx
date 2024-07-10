import { FC } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch, Login, Register, EmployeeView } from "@/pages";
import { PrivateRoute } from "@/widgets";

const App: FC = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
          <Route path="/employee/new" element={<EmployeeView />} />
          <Route path="/employee/:id" element={<EmployeeView />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
