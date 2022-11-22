import * as functions from "firebase-functions"
/**
 * Used to check if the headers are valid
 */
export class HeadersGuard {
  /**
   * Checks if the token is string
   * @param {string|string[]|undefined} token
   * @return {boolean}
   */
  static isTokenValid(token: string | string[] | undefined): token is string {
    if (!token || token instanceof Array) {
      return false
    }
    return true
  }
  /**
   * !Dirty, but it works
   * @param {Request} request
   * @param {Response} response
   * @param {Function} onSuccess
   */
  static getToken(
      request: functions.https.Request,
      response: functions.Response,
      onSuccess: (token: string) => void
  ): void {
    const token: string | string[] | undefined = request.headers["access_token"]
    if (!this.isTokenValid(token)) {
      response.status(401).send("Unauthorized, invalid token")
      return
    }
    onSuccess(token)
  }
}
