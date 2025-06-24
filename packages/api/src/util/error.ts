export type StatusMessage =
  | 'PaperNotFound'
  | 'NoConclusionSectionFoundError'
  | 'InternalServeError'

/**
 * ErrorWithStatus is a custom error class that extends the built-in Error class.
 * It includes an HTTP status code and a status message to provide more context about the error.
 */
export class ErrorWithStatus extends Error {
  public status: number
  public statusMessage: StatusMessage

  /**
   * Create an error with a specific status code and message.
   * @param message - The error message.
   * @param status - The HTTP status code.
   * @param statusMessage - The status message.
   */
  constructor(
    message: string,
    status: number,
    statusMessage: StatusMessage = 'InternalServeError',
  ) {
    super(message)
    this.status = status
    this.statusMessage = statusMessage
    this.name = 'ErrorWithStatus'

    Object.setPrototypeOf(this, ErrorWithStatus.prototype)
  }
}
