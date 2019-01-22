import React from 'react'
import AuthUserContext from './AuthUserContext'
import { firebaseAuth } from '../firebase'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
        idToken: null
      }
    }

    componentDidMount = () => {
      firebaseAuth.onAuthStateChanged((authUser) => {
        if (authUser) {
          authUser.getIdToken(true)
            .then(idToken => this.setState({ authUser, idToken }))
            .catch(error => console.error(error.message))
        } else {
          this.setState({ authUser: null, idToken: null })
        }
      })
    }

    render() {
      const { authUser, idToken } = this.state
      return (
        <AuthUserContext.Provider value={{ authUser, idToken }}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
