import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "Aluna ID", width: 100 },
  { field: "firstName", headerName: "Primeiro nome", width: 130 },
  { field: "lastName", headerName: "Sobrenome", width: 130 },
  {
    field: "age",
    headerName: "Idade",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Nome completo",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function TablePagination() {
  return (
    <div
      style={{
        height: 420,
        width: "85%",
        margin: "0 auto",
        background: "#FFF",
        padding: "0 20px",
        marginTop: "100px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ border: "none", borderBottom: "none" }}
      />
    </div>
  );
}
