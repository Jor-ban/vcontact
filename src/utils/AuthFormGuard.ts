export class AuthFormGuard {
  static checkEmail(email: string): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return emailRegex.test(email)
  }
  static checkPassword(password: string): boolean {
    const passwordRegex = /[a-zA-Z\d]{8,}/g
    return passwordRegex.test(password)
  }
  static checkName(name: string): boolean {
    const nameRegex = /[a-zA-Z]{2,}/g
    return nameRegex.test(name)
  }
}
