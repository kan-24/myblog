import type { UploadPayload, UploadResult, UploadService } from './UploadService';

export class LocalUploadAdapter implements UploadService {
  async upload({ file }: UploadPayload): Promise<UploadResult> {
    const base64 = await this.readFile(file);
    return {
      url: base64,
      base64
    };
  }

  private readFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
