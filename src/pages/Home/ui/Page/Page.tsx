import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchEmployees } from '@/app/useFetchEmployees';
import { EmployeeData } from "types/vite-env";
import ResponsiveTable from "@/widgets/CustomTable";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const columns = [
  {
    title: "First Name",
    field: "firstName",
    show: true,
  },
  {
    title: "Last Name",
    field: "lastName",
    show: true,
  },
  {
    title: "Department",
    field: "department",
    show: true,
  },
  {
    title: "Phone",
    field: "phone",
    show: true,
  },
];

const Home: FC = () => {
  const navigate = useNavigate();
  const { employees, loading, error } = useFetchEmployees();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const onTableDataClick = (employee: EmployeeData & { index: number }) => {
    navigate(`/employee/${employee.id}`, { state: { employee } });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalItems = employees.payload.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const paginatedData = employees.payload.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGeneratePDF = () => {
    const contentElement = document.getElementById("employee-table");

    if (contentElement) {
      html2canvas(contentElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("employees.pdf");
      });
    } else {
      console.error("Element with id 'employee-table' not found.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <section>
        <div className="min-h-screen bg-light-secondary p-2">
          <div className="px-4 py-2 flex-col lg:flex-row bg-white rounded-sm shadow-md">
            <div className="flex flex-row justify-between mb-4">
              <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/employee/new')}>
                  New
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={handleGeneratePDF}>
                  Export PDF
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </button>
                <span>
                  {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    employees.payload.length
                  )} of ${employees.payload.length}`}
                </span>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage * itemsPerPage >= employees.payload.length}
                >
                  {">"}
                </button>
              </div>
            </div>

            <ResponsiveTable
              data={paginatedData}
              columns={columns}
              onTableDataClick={onTableDataClick}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
