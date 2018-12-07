import React from 'react'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'

const MenuHeader = () => (
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
)

export default MenuHeader
