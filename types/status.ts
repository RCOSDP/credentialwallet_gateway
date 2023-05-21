export type RequestStatus = "waiting" | "loading" | "failed" | "requested";
export type QRCodeStatus =
  | "waiting"
  | "scanned"
  | "success"
  | "failed"
  | "none";

export type IssuanceStatus =
  | null
  | "request_retrieved"
  | "issuance_successful"
  | "issuance_error";
export type PresentationStatus =
  | null
  | "request_retrieved"
  | "presentation_verified";
