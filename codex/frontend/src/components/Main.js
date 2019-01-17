import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as routes from '../constants/routes'
import HomePage from './pages/HomePage'
import WallPage from './pages/WallPage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
// import PasswordForget from './pages/PasswordForget'

const Main = props => (
  <Switch>
    <Route exact path={routes.HOME} component={HomePage} />
    <Route exact path={routes.WALL} component={WallPage} />
    <Route exact path={routes.SIGN_UP} component={SignUpPage} />
    <Route exact path={routes.SIGN_IN} component={SignInPage} />
    <Route exact path={routes.FORGOT_PASSWORD} component={ForgotPasswordPage} />
  </Switch>
)

Main.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }),
  idToken: PropTypes.string,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired
  })
}

Main.defaultProps = {
  authUser: null,
  idToken: null,
  user: null
}

export default Main
