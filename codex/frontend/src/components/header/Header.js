import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Icon,
  Avatar
} from 'antd'
import logo from '../../assets/images/logo.svg'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'

const { Header } = Layout

const INITIAL_STATE = {
  collapsed: 0,
  menuVisible: false
}

class MenuHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    this.setIsCollapsed()
    window.addEventListener('resize', this.setIsCollapsed)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setIsCollapsed)
  }

  setIsCollapsed = () => {
    this.setState({
      collapsed: window.innerWidth < 768
    })
  }

  getMenu = (collapsed, authUser, user) => (
    (authUser && user) ?
      (
        <Menu
          theme={collapsed ? 'light' : 'dark'}
          mode={collapsed ? 'vertical' : 'horizontal'}
          selectable={false}
          className="menu"
        >
          <Menu.Item>
            <Link to={routes.WALL}>Wall</Link>
          </Menu.Item>
          <Menu.SubMenu
            title={collapsed ? 'Profile' : (<div type="menu"><Avatar size={35} /></div>)}
          >
            <Menu.Item>
              <Link to={routes.PROFILE}>Profile</Link>
            </Menu.Item>
            <Menu.Item>
              <Button type="primary" onClick={auth.doSignOut} style={{ width: '100%' }}>Sign Out</Button>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      ) : (
        <Menu
          theme={collapsed ? 'light' : 'dark'}
          mode={collapsed ? 'vertical' : 'horizontal'}
          selectable={false}
          className="menu"
        >
          <Menu.Item>
            <Link to={routes.SIGN_IN}>Sign In</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={routes.SIGN_UP}>Sign Up</Link>
          </Menu.Item>
        </Menu>
      )
  )

  render() {
    const { collapsed } = this.state
    const { authUser, user } = this.props

    return (
      <Header>
        <Link to={routes.HOME}>
          <div className="logo clearfix noselect">
            <div className="logo-img">
              <img src={logo} alt="brand-logo" />
            </div>
            <div className="logo-txt">
              CODEX
            </div>
          </div>
        </Link>
        { collapsed ?
          (
            <Dropdown
              overlay={this.getMenu(collapsed, authUser, user)}
              trigger={['click']}
              placement="bottomRight"
            >
              <Icon
                className="icon-hamburger"
                type="menu"
              />
            </Dropdown>
          ) : (
            this.getMenu(collapsed, authUser, user)
          )
        }
      </Header>
    )
  }
}

MenuHeader.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }),
  user: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  })
}

MenuHeader.defaultProps = {
  authUser: null,
  user: null
}

export default MenuHeader
