import auth from './firebase'

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password) // eslint-disable-line implicit-arrow-linebreak, max-len

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password) // eslint-disable-line implicit-arrow-linebreak

// Sign out
export const doSignOut = () => auth.signOut()
