/**
 * @typedef {Object} UploadPayload
 * @property {string} name
 * @property {File} file
 */

/**
 * @typedef {Object} UploadResult
 * @property {string} url
 * @property {string} [base64]
 */

/**
 * @typedef {{ upload(payload: UploadPayload): Promise<UploadResult> }} UploadService
 */

export {}
