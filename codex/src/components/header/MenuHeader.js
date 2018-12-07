import React from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from 'semantic-ui-react'
import * as routes from '../../constants/routes'


const MenuHeader = () => (
  <Container>
    <div className="ui inverted menu">
      <Link className="active item" to={routes.HOME}>
        CODEX
      </Link>
      <Link className="item" to={routes.SIGN_IN}>
        Sign in
      </Link>
      <Link className="item" to={routes.SIGN_UP}>
        Sign up
      </Link>
    </div>
  </Container>
)

export default MenuHeader
