// Placeholder adapter for integrating a real cloud provider.
export class CloudUploadAdapter {
  /**
   * @param {import('./UploadService').UploadPayload} _payload
   * @returns {Promise<import('./UploadService').UploadResult>}
   */
  async upload(_payload) {
    throw new Error('CloudUploadAdapter is not configured. Replace with actual implementation.')
  }
}
