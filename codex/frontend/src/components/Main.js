import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as routes from '../constants/routes'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PasswordForget from './pages/PasswordForget'
import PasswordChange from './pages/PasswordChange'

const Main = props => (
  <div>
    <Switch>
      <Route exact path={routes.HOME} component={Home} />
      <Route exact path={routes.SIGN_UP} component={SignUp} />
      <Route exact path={routes.SIGN_IN} component={SignIn} />
      <Route exact path={routes.PASSWORD_FORGET} component={PasswordForget} />
      <Route exact path={routes.PASSWORD_CHANGE} component={PasswordChange} />
    </Switch>
  </div>
)

Main.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired
  })
}

Main.defaultProps = {
  authUser: null
}

export default Main
