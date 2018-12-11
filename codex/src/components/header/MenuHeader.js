import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Button } from 'semantic-ui-react'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'
import AuthUserContext from '../AuthUserContext'

const AuthNav = () => (
  <React.Fragment>
    <Button.Group floated="right">
      <Button onClick={auth.doSignOut}>Sign out</Button>
    </Button.Group>
  </React.Fragment>
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
  <Menu>
    <Link className="active item" to={routes.HOME}>
      CODEX
    </Link>
    <AuthUserContext.Consumer>
      {
        ({ authUser }) => (authUser ? <AuthNav /> : <NonAuthNav />)
      }
    </AuthUserContext.Consumer>
  </Menu>
)

export default MenuHeader
