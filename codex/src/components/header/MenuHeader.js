import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Container, Segment, Button } from 'semantic-ui-react'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'
import AuthUserContext from '../AuthUserContext'

const AuthNav = props => (
  <React.Fragment>
    <Button className="item" floated="right" onClick={auth.doSignOut}>Sign out</Button>
  </React.Fragment>
)

const NonAuthNav = props => (
  <React.Fragment>
    <Menu.Item as={Link} position="right" to={routes.SIGN_IN} active={props.location.pathname === routes.SIGN_IN}>
      Sign in
    </Menu.Item>
    <Menu.Item as={Link} to={routes.SIGN_UP} style={{ marginLeft: '0.5em' }} active={props.location.pathname === routes.SIGN_UP}>
      Sign up
    </Menu.Item>
  </React.Fragment>
)

const MenuHeader = props => (
  <Segment inverted>
    <Container>
      <Menu inverted pointing secondary>
        <Menu.Item as={Link} to={routes.HOME}>
          CODEX
        </Menu.Item>
        <AuthUserContext.Consumer>
          {
            ({ authUser }) => (authUser ? <AuthNav {...props} /> : <NonAuthNav {...props} />)
          }
        </AuthUserContext.Consumer>
      </Menu>
    </Container>
  </Segment>
)

export default withRouter(MenuHeader)
