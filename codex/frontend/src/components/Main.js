import React from 'react'
import { Switch, Route } from 'react-router-dom'
import * as routes from '../constants/routes'
import AuthUserContext from './AuthUserContext'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PasswordForget from './pages/PasswordForget'
import PasswordChange from './pages/PasswordChange'

const Main = () => (
  <div>
    <AuthUserContext.Consumer>
      {
        // eslint-disable-next-line no-unused-vars
        ({ authUser }) => (
          <Switch>
            <Route exact path={routes.HOME} component={Home} />
            <Route exact path={routes.SIGN_UP} component={SignUp} />
            <Route exact path={routes.SIGN_IN} component={SignIn} />
            <Route exact path={routes.PASSWORD_FORGET} component={PasswordForget} />
            <Route exact path={routes.PASSWORD_CHANGE} component={PasswordChange} />
          </Switch>
        )
      }
    </AuthUserContext.Consumer>
  </div>
)

export default Main
