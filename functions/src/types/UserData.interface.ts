import {DocumentData} from "firebase/firestore"

export interface UserDataInterface extends DocumentData {
  name: string
  email: string
  password: string
}
