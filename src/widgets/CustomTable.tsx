import React, { useEffect, useState } from "react";
import { EmployeeData } from "types/vite-env";

interface Column {
  field: string;
  title: string;
  show: boolean;
}

interface ResponsiveTableProps {
  data: EmployeeData[];
  onTableDataClick: (employee: EmployeeData & { index: number }) => void;
  columns: Column[];
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ data, onTableDataClick, columns }) => {
  const [tableMaxWidth, setTableMaxWidth] = useState(0);
  const [tableMaxHeight, setTableMaxHeight] = useState(0);

  const calculateMaxWidth = () => {
    const screenWidth = window.innerWidth;
    const paddingMarginAdjustment = 160; 
    const calculatedWidth = screenWidth - paddingMarginAdjustment;

    setTableMaxWidth(calculatedWidth); 
  };

  const calculateMaxHeight = () => {
    const screenHeight = window.innerHeight;
    const navHeight = 70; 
    const footerHeight = 30; 
    const calculatedHeight = screenHeight - navHeight - footerHeight;

    setTableMaxHeight(calculatedHeight);
  };

  useEffect(() => {
    calculateMaxWidth(); 
    calculateMaxHeight();

    const handleResize = () => {
      calculateMaxWidth(); 
      calculateMaxHeight();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="overflow-x-auto" >
      <div className="channel-table overflow-y-auto" style={{ maxHeight: `${tableMaxHeight}px` }}>
        <table id="employee-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns
                .filter((col) => col.show)
                .map((col, idx) => (
                  <th
                    key={idx}
                    className="pl-1 py-2 text-left text-sm font-semibold uppercase tracking-wider"
                    style={{ color: "#000000" }}
                  >
                    {col.title}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="cursor-pointer hover:bg-gray-100">
                {columns.map((col, idx) => (
                  <td
                    key={col.field}
                    className="text-epg-text-row font-light px-1"
                    style={{
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#404656"
                    }}
                    onClick={() => onTableDataClick({ ...item, index })}
                  >
                    {item[col.field as keyof EmployeeData]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;
