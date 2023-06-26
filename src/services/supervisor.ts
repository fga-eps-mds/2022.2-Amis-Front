import { AxiosError } from "axios";
import { apiUser } from "./api";
import { SupervisorDTO } from "../pages/supervisor/dtos/SupervisorDTO";
import { EditarSupervisorDTO } from "../pages/supervisor/dtos/EditSupervisorDTO";

export async function cadastrarSupervisor(payload: SupervisorDTO) {
  return await apiUser
    .post<SupervisorDTO>("/supervisor/", payload)
    .then((response) => response)
    .catch((error: AxiosError) => error);
}

export async function listarSupervisor() {
  return await apiUser
    .get<SupervisorDTO[]>("/supervisor/")
    .catch((error: AxiosError) => error);
}

export async function editarSupervisor(
  supervisorId: string,
  supervisor: EditarSupervisorDTO
) {
  return await apiUser
    .put<SupervisorDTO>("/supervisor/" + supervisorId, supervisor)
    .then((response) => response)
    .catch((error) => error);
}

export async function excluirSupervisor(supervisorId: string): Promise<void> {
  await apiUser
    .delete("/supervisor/" + supervisorId)
    .then((response) => response)
    .catch((error) => error);
}
