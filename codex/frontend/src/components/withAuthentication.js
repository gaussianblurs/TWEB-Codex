import React from 'react'
import axios from '../axios'
import AuthUserContext from './AuthUserContext'
import { firebaseAuth } from '../firebase'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
        idToken: null,
        user: null
      }
    }

    componentDidMount = () => {
      firebaseAuth.onAuthStateChanged((authUser) => {
        if (authUser) {
          authUser.getIdToken(true)
            .then(idToken => this.setState({ authUser, idToken }))
            .then(() => this.fetchUserFromDb())
            .catch(error => console.error(error.message))
        } else {
          this.setState({ authUser: null, idToken: null, user: null })
        }
      })
    }

    fetchUserFromDb = () => axios.get(`/users/${this.state.authUser.uid}`, { headers: { Authorization: `Bearer ${this.state.idToken}` } })
      .then(response => {
        console.log(response)
        this.setState({ user: response.data })
      })
      .catch((error) => { console.error(error.message) })

    render() {
      const { authUser, idToken, user } = this.state
      return (
        <AuthUserContext.Provider value={{ authUser, idToken, user }}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
