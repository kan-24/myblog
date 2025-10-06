export interface UploadPayload {
  name: string;
  file: File;
}

export interface UploadResult {
  url: string;
  base64?: string;
}

export interface UploadService {
  upload(payload: UploadPayload): Promise<UploadResult>;
}
