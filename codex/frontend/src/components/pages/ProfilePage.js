import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Layout, Avatar, Button } from 'antd'

import * as routes from '../../constants/routes'
import '../../assets/scss/ProfilePage.scss'

const { Content } = Layout

const INITIAL_STATE = {}

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  handleClick = () => {
    this.props.history.push(routes.EDIT_PROFILE)
  }

  render() {
    const { user, authUser } = this.props

    return (
      <Content>
        <div className="main-container profile">
          <div>
            <h2>Profile</h2>
            <hr />
          </div>
          <div className="clearfix">
            <Avatar size={150} icon="user" className="avatar" />
            <div className="infos">
              <h2>Nickname</h2>
              <p>{user.nickname}</p>
              <h2>E-mail</h2>
              <p>{authUser.email}</p>
              <div className="clearfix">
                <Button onClick={this.handleClick} type="primary" className="edit-btn"> Edit Profile</Button>
              </div>
            </div>
          </div>
          <div>
            <h2>Posts</h2>
            <hr />
          </div>
        </div>
      </Content>
    )
  }
}

ProfilePage.propTypes = {
  history: PropTypes.PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
}

export default withRouter(ProfilePage)
