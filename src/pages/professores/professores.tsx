import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../../shared/components/Sidebar/sidebar";
import Navbarlog from "../../shared/components/NavbarLogada/navbarLogada";
import DataTable from "../../shared/components/TablePagination/tablePagination";
import { GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import { queryClient } from "../../services/queryClient";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";

import {
  Box,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";


export function Professores() {
    const [open, setOpen] = useState(false);
    const [professore, setProfessor] = useState({});
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [dataTable, setDataTable] = useState([]);
    const [id, setId] = useState(0);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
  
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
  
    return (
      <div>
      </div>
    );
  }
  
  
  
  
  
  
  