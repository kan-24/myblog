import type { UploadPayload, UploadResult, UploadService } from './UploadService';

// Placeholder adapter for integrating a real cloud provider.
export class CloudUploadAdapter implements UploadService {
  async upload(_payload: UploadPayload): Promise<UploadResult> {
    throw new Error('CloudUploadAdapter is not configured. Replace with actual implementation.');
  }
}
