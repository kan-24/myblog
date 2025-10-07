/**
 * @implements {import('./UploadService').UploadService}
 */
export class LocalUploadAdapter {
  /**
   * @param {import('./UploadService').UploadPayload} payload
   * @returns {Promise<import('./UploadService').UploadResult>}
   */
  async upload({ file }) {
    const base64 = await this.readFile(file)
    return {
      url: base64,
      base64
    }
  }

  /**
   * @param {File} file
   * @returns {Promise<string>}
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(/** @type {string} */ (reader.result))
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }
}
