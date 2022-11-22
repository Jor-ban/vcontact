export class ContactFormGuard {
  static isNameValid(name: string): boolean {
    const nameRegex = /[a-zA-Z]{2,}/g
    return nameRegex.test(name)
  }
  static checkPhone(phone: string): boolean {
    const phoneRegex = /[0-9\+\-]{9}/g
    return phoneRegex.test(phone)
  }
  static checkEmail(email: string): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return emailRegex.test(email)
  }
}
