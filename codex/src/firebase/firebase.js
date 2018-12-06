import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyCZNgivBbht3qCJeDWBGOlr9qnfrd1OHkU',
  authDomain: 'codex-496fb.firebaseapp.com',
  databaseURL: 'https://codex-496fb.firebaseio.com',
  projectId: 'codex-496fb',
  storageBucket: '',
  messagingSenderId: '164412869274'
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const auth = firebase.auth()

export default auth
