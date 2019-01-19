import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Icon
} from 'antd'
import logo from '../../assets/images/logo.svg'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'

const { Header } = Layout

const AuthNav = () => (
  <React.Fragment>
    <Button key="4">Sign out</Button>
  </React.Fragment>
)

const NonAuthNav = props => (
  <React.Fragment>
    <Menu
      className="menu"
      theme="dark"
      mode="horizontal"
    >
      <Menu.Item key="1"><Link to={routes.SIGN_IN}>Sign In</Link></Menu.Item>
      <Menu.Item key="2"><Link to={routes.SIGN_UP}>Sign Up</Link></Menu.Item>
      <Menu.Item key="3"><Button type="primary" onClick={auth.doSignOut}>Sign Out</Button></Menu.Item>
    </Menu>
  </React.Fragment>
)

NonAuthNav.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
}

const INITIAL_STATE = {
  viewportWidth: 0,
  menuVisible: false
}

class MenuHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    this.saveViewportDimensions()
    window.addEventListener('resize', this.saveViewportDimensions)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.saveViewportDimensions)
  }

  saveViewportDimensions = () => {
    this.setState({
      viewportWidth: window.innerWidth
    })
  }

  menu = mode => (
    <React.Fragment>
      <Menu
        className="menu"
        theme="dark"
        mode={mode}
      >
        <Menu.Item key="1"><Link to={routes.SIGN_IN}>Sign In</Link></Menu.Item>
        <Menu.Item key="2"><Link to={routes.SIGN_UP}>Sign Up</Link></Menu.Item>
        <Menu.Item key="3"><Button type="primary" onClick={auth.doSignOut}>Sign Out</Button></Menu.Item>
      </Menu>
    </React.Fragment>
  )

  render() {
    return (
      <Header>
        <div className="logo clearfix noselect">
          <div className="logo-img">
            <img src={logo} alt="brand-logo" />
          </div>
          <div className="logo-txt">
            CODEX
          </div>
        </div>
        { this.state.viewportWidth > 768 ?
          (
            this.menu('horizontal')
          ) : (
            <Dropdown overlay={this.menu('vertical')} trigger={['click']}>
              <Icon
                className="icon-hamburger"
                type="menu"
              />
            </Dropdown>
          )
        }
      </Header>
    )
  }
}

MenuHeader.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired
  })
}

MenuHeader.defaultProps = {
  authUser: null
}

export default MenuHeader
