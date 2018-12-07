import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Container, Segment, Button } from 'semantic-ui-react'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'
import AuthUserContext from '../AuthUserContext'

const AuthNav = () => (
  <React.Fragment>
    <Button className="item" floated="right" onClick={auth.doSignOut}>Sign out</Button>
  </React.Fragment>
)

const NonAuthNav = () => (
  <React.Fragment>
    <Menu.Item position="right">
      <Link to={routes.SIGN_IN}>
        Sign in
      </Link>
      <Link to={routes.SIGN_UP} style={{ marginLeft: '0.5em' }}>
        Sign up
      </Link>
    </Menu.Item>
  </React.Fragment>
)

const MenuHeader = () => (
  <Segment inverted>
    <Container>
      <Menu inverted pointing secondary>
        <Menu.Item as={Link} to={routes.HOME}>
          CODEX
        </Menu.Item>
        <AuthUserContext.Consumer>
          {
            ({ authUser }) => (authUser ? <AuthNav /> : <NonAuthNav />)
          }
        </AuthUserContext.Consumer>
      </Menu>
    </Container>
  </Segment>
)

export default MenuHeader
