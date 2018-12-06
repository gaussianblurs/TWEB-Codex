import React from 'react'
import { withRouter } from 'react-router-dom'
import AuthUserContext from './AuthUserContext'
import { firebaseAuth } from '../firebase'
import * as routes from '../constants/routes'
import Spinner from './utils/Spinner'

const withAuthorization = authCondition => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebaseAuth.onAuthStateChanged((authUser) => {
        if (!authCondition(authUser)) {
          this.props.history.push(routes.SIGN_IN)
        }
      })
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          { ({ authUser, collaborator }) => (authUser && collaborator ?
            <Component {...this.props} /> : <Spinner /> )}
        </AuthUserContext.Consumer>
      )
    }
  }

  return withRouter(WithAuthorization)
}

export default withAuthorization
