import {ContactValidator} from "./utils/ContactValidator"
import {ContactInterface} from "./types/Contact.interface"
import {HeadersGuard} from "./utils/HeadersGuard"
import {UserDataInterface} from "./types/UserData.interface"
import {db} from "./firebaseConfig"
import * as functions from "firebase-functions"
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore"
import * as cors from "cors"
const corsHandler = cors({origin: true})

type Request = functions.https.Request
type Response = functions.Response

const corsSafe = (callback: (request: Request, response: Response) => Promise<void> | void) =>
  functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
      callback(request, response)
    })
  })

export const registrate = corsSafe((request, response) => {
  const {email, password, name} = request.body as UserDataInterface
  if (!email || !password || !name) {
    response.status(400).send("Missing required fields (email, password, name)")
    return
  }
  const q = query(collection(db, "users"), where("email", "==", email))
  getDocs(q).then((querySnapshot) => {
    if (querySnapshot.empty) {
      addDoc(collection(db, "users"), {email, password, name}).then((docRef) => {
        response.status(200).send({token: docRef.id, email, name})
      })
    } else {
      response.status(400).send("User with such email already exists")
    }
  })
})

export const login = corsSafe((request, response) => {
  const {email, password} = request.body as UserDataInterface
  if (!email || !password) {
    response.status(400).send("Missing required fields (email, password)")
    return
  }
  const q = query(collection(db, "users"), where("email", "==", email))
  getDocs(q).then((querySnapshot) => {
    if (querySnapshot.empty) {
      response.status(400).send("No user found")
    } else {
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().password == password) {
          response.status(200).send({token: doc.id, email, name: doc.data().name})
        } else {
          response.status(400).send("Credentials mismatch")
        }
      })
    }
  })
})

export const getUser = corsSafe(
    (request, response) => HeadersGuard.getToken(request, response, async (token) => {
      getDoc(doc(db, "users", token)).then((doc) => {
        if (doc.exists()) {
          const data = doc.data()
          response.status(200).send({name: data.name, email: data.email, token: doc.id})
        } else {
          response.status(404).send("No such document!")
        }
      })
    })
)

export const getAllContacts = corsSafe(
    (request, response) => HeadersGuard.getToken(request, response, async (token) => {
      const userDocRef = doc(db, "users", token)
      const contactsCollectionRef = collection(userDocRef, "contacts")
      getDocs(contactsCollectionRef).then((contactSnapshots) => {
        const contacts = contactSnapshots.docs.map((doc) => ({...doc.data(), id: doc.id}))
        response.status(200).send(contacts)
      })
    })
)

export const contact = corsSafe(
    (request, response) => HeadersGuard.getToken(request, response, async (token) => {
      try {
        if (request.method === "GET") {
          await getContact(request, response, token)
        } else if (request.method === "POST" || request.method === "PATCH") {
          const contactData = request.body as ContactInterface
          if (!ContactValidator.isValid(contactData)) {
            response
                .status(400)
                .send("Bad request, invalid contact (must have name, tags and at least one of email or phone)")
            return
          }
          request.method === "POST" ?
              await addContact(request, response, token) :
              await updateContact(request, response, token)
        } else if (request.method === "DELETE") {
          await deleteContact(request, response, token)
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        response.status(500).send(e.message ?? "Internal server error")
      }
    })
)

/**
 * GET method for a single contact
 * @param {Request} request
 * @param {Response} response
 * @param {string} token
 */
async function getContact(request: Request, response: Response, token: string) {
  if (request.query.id && typeof request.query.id === "string") {
    const userDocRef = doc(db, "users", token)
    const contactsCollectionRef = collection(userDocRef, "contacts")
    const contactDocRef = doc(contactsCollectionRef, request.query.id)
    getDoc(contactDocRef).then((contactSnapshot) => {
      const contact = contactSnapshot.data()
      response.status(200).send(contact)
    }).catch((e) => {
      response.status(404).send(e.message ?? "No such contact")
    })
  } else {
    response.status(400).send("Bad request, missing id in query params (must be string)")
  }
}

/**
 * POST method for a single contact, creates a new contact
 * @param {Request} request
 * @param {Response} response
 * @param {string} token
 */
async function addContact(request: Request, response: Response, token: string) {
  const contactData = request.body as ContactInterface
  const userDocRef = doc(db, "users", token)
  const contactsCollectionRef = collection(userDocRef, "contacts")
  addDoc(contactsCollectionRef, contactData).then((contactDocRef) => {
    response.status(200).send({...contactData, id: contactDocRef.id})
  })
}
/**
 * PATCH method for a single contact, updates existing contact
 * @param {Request} request
 * @param {Response} response
 * @param {string} token
 */
async function updateContact(request: Request, response: Response, token: string) {
  if (request.query.id && typeof request.query.id === "string") {
    const contactData = request.body as ContactInterface
    const userDocRef = doc(db, "users", token)
    const contactsCollectionRef = collection(userDocRef, "contacts")
    const contactDocRef = doc(contactsCollectionRef, request.query.id ?? contactData.id)
    const finalData = {...contactData}
    delete finalData.id
    updateDoc(contactDocRef, finalData).then(() => {
      response.status(200).send({...finalData, id: request.query.id})
    })
  } else {
    response.status(400).send("Bad request, missing id in query params (must be string)")
  }
}
/**
 * DELETE method for a single contact, deletes existing contact
 * @param {Request} request
 * @param {Response} response
 * @param {string} token
 */
async function deleteContact(request: Request, response: Response, token: string) {
  if (request.query.id && typeof request.query.id === "string") {
    const userDocRef = doc(db, "users", token)
    const contactsCollectionRef = collection(userDocRef, "contacts")
    const contactDocRef = doc(contactsCollectionRef, request.query.id)
    deleteDoc(contactDocRef).then(() => {
      response.status(200).send("Contact deleted")
    })
  } else {
    response.status(400).send("Bad request, missing id in query params (must be string)")
  }
}
