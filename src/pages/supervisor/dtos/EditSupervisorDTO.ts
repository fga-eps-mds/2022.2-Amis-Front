import { SupervisorDTO } from "./SupervisorDTO";

export type EditarSupervisorDTO = Omit<
  Omit<SupervisorDTO, "senha">,
  "senhaConfirmada"
>;
