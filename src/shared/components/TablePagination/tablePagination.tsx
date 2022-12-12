import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface TableProps {
  data: Object[];
  columns: GridColDef[];
}

export default function TablePagination(props: TableProps) {
  return (
    <div
      style={{
        height: 420,
        width: "85%",
        margin: "0 auto",
        background: "#FFF",
        padding: "0 20px",
        marginTop: "50px",
      }}
    >
      <DataGrid
        rows={props.data}
        columns={props.columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ border: "none", borderBottom: "none" }}
      />
    </div>
  );
}
