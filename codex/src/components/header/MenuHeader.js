import React from 'react'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'
import AuthUserContext from '../AuthUserContext'

const AuthNav = () => (
  <React.Fragment />
)

const NonAuthNav = () => (
  <React.Fragment>
    <Link className="item" to={routes.SIGN_IN}>
      Sign in
    </Link>
    <Link className="item" to={routes.SIGN_UP}>
      Sign up
    </Link>
  </React.Fragment>
)

const MenuHeader = () => (
  <div className="ui inverted menu">
    <Link className="active item" to={routes.HOME}>
      CODEX
    </Link>
    <AuthUserContext.Consumer>
      {
        ({ authUser }) => (authUser ? <AuthNav /> : <NonAuthNav />)
      }
    </AuthUserContext.Consumer>
  </div>
)

export default MenuHeader
