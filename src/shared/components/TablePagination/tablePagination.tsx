import * as React from "react";
import { DataGrid, GridActionsColDef, GridColDef } from "@mui/x-data-grid";

export interface TableProps {
  data: Object[];
  columns: Array<GridColDef | GridActionsColDef>;
  getRowId?: (row: any) => string;
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
        getRowId={props.getRowId}
        rows={props.data}
        columns={props.columns}
        disableSelectionOnClick={true}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{ border: "none", borderBottom: "none" }}
      />
    </div>
  );
}
