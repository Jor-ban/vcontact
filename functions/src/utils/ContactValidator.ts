import {ContactInterface} from "../types/Contact.interface"

/**
 * Validates a contact object
 */
export class ContactValidator {
  /**
   * Checks if the contact is valid
   * @param {ContactInterface} contact
   * @return {boolean}
   */
  static isValid(contact: ContactInterface): boolean {
    if (!contact.name || !contact.tags || (!contact.email && !contact.phone)) {
      return false
    }
    return true
  }
}
