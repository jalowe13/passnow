// Code imported designed and modified from
// https://ant.design/components/table#components-table-demo-dynamic-settings

import React, { useState, useEffect } from "react";
import type { GetProp, TableProps } from "antd";
import { Table } from "antd";

type SizeType = TableProps["size"];
type ColumnsType<T extends object> = GetProp<TableProps<T>, "columns">;
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

interface DataType {
  key: number;
  name: string;
  password: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Password",
    dataIndex: "password",
  },
];

interface DataType {
  key: number;
  name: string;
  password: string;
}

interface PasswordImportMenuProps {
  file: File | null;
}

const PasswordImportMenu: React.FC<PasswordImportMenuProps> = ({ file }) => {
  const [loading, setLoading] = useState(true);
  const [size] = useState<SizeType>("small");
  const [parsedData, setParsedData] = useState<DataType[]>([]);

  const [hasData] = useState(true);
  const [top] = useState<TablePaginationPosition>("none");
  const [bottom] = useState<TablePaginationPosition>("bottomRight");
  const [ellipsis] = useState(false);
  const [yScroll] = useState(false);
  const [xScroll] = useState<string>();
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType>>(
    {
      // Setting Row selection, initially all selected
      selectedRowKeys: [],
      onChange: (selectedRowKeys) => {
        setRowSelection((prevState) => ({
          ...prevState,
          selectedRowKeys,
        }));
      },
    }
  );

  useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) {
          const text = e.target.result as string;
          const data = text
            .split("\n")
            .slice(1)
            .map((line, index) => {
              // Handling special cases where there are quotes not needed and double repeating quotes
              // Works for if there are parsing errors with the csv
              // Split the line by commas not within double quotes
              const fields = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
              // Clean up the fields
              const cleanedFields = fields.map((field) =>
                field.replace(/^"|"$/g, "").replace(/""/g, '"')
              );
              const [column1, column2] = cleanedFields;
              return { key: index + 1, name: column1, password: column2 };
            });
          setParsedData(data);
          // Set all rows to be selected by default
          setRowSelection({
            ...rowSelection,
            selectedRowKeys: data.map((item) => item.key), // Use the keys of the parsed data
          });
          // Fade in time for loading
          const timer = setTimeout(() => setLoading(false), 100);
          return () => clearTimeout(timer); // Cleanup the timer
        }
      };

      reader.readAsText(file);
    }
  }, [file]); // Empty dependency array means this effect runs once on mount

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
  }

  const tableProps: TableProps<DataType> = {
    size,
    loading,
    rowSelection,
  };

  return (
    <>
      {file === null ? (
        <div>No file selected</div>
      ) : (
        <Table
          {...tableProps}
          pagination={{ position: [top, bottom] }}
          columns={tableColumns}
          dataSource={hasData ? parsedData : []}
          scroll={scroll}
        />
      )}
    </>
  );
};

export default PasswordImportMenu;
