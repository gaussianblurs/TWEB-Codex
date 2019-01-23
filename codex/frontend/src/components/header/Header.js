import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Icon,
  Avatar,
  Popover,
  message
} from 'antd'
import logo from '../../assets/images/logo.svg'
import * as routes from '../../constants/routes'
import { auth, firebaseAuth } from '../../firebase'
import axios from '../../axios'

const { Header } = Layout

const INITIAL_STATE = {
  collapsed: 0,
  menuVisible: false,
  user: null
}

class MenuHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    this.setIsCollapsed()
    window.addEventListener('resize', this.setIsCollapsed)
    firebaseAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        authUser.getIdToken()
          .then(idToken => axios.get(`/users/${authUser.uid}`, {
            headers: { Authorization: `Bearer: ${idToken}` }
          })
            .then(response => this.setState({
              user: response.data
            }))
            .catch(error => message.error(error.message)))
      }
    })
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
          <Menu.Item>
            <Popover
              placement={collapsed ? 'left' : 'bottomRight'}
              title="Notifications"
              content={<p>Hello</p>}
              trigger={collapsed ? 'hover' : 'click'}
            >
              <div className="icon-bell">
                <Icon
                  type="bell"
                />
              </div>
            </Popover>
          </Menu.Item>
          <Menu.SubMenu
            title={collapsed ? 'Profile' : (<div type="menu"><Avatar size={35} /></div>)}
          >
            <Menu.Item>
              <Link to={`${routes.PROFILE}/${authUser.uid}`}>Profile</Link>
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
    const { collapsed, user } = this.state
    const { authUser } = this.props

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
  })
}

MenuHeader.defaultProps = {
  authUser: null
}

export default MenuHeader
