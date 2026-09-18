export interface FindRoomByCodeRequest {
  salaCodigoInvitacion: string;
}

export interface FindRoomByCodeResponse {
  sala: {
    salaId: string;
    salaNombre: string;
    salaCodigoInvitacion: string;
  } | null;
}