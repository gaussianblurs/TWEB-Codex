import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Layout, Avatar, Button, message } from 'antd'
import Spinner from '../utils/Spinner'
import * as routes from '../../constants/routes'
import axios from '../../axios'
import withAuthorization from '../withAuthorization'
import Posts from '../posts/Posts'

import '../../assets/scss/ProfilePage.scss'

const { Content } = Layout

const INITIAL_STATE = {
  hasLoaded: false,
  user: null,
  posts: []
}

class ProfilePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    axios.get(`/users/${this.props.match.params.id}`, {
      headers: { Authorization: `Bearer: ${this.props.idToken}` }
    })
      .then(response => this.setState({
        user: response.data,
        hasLoaded: true
      }))
      .catch(error => message.error(error.message))
    this.fetchUserPosts()
  }

  fetchUserPosts = () => {
    axios.get(
      `/user/${this.props.match.params.id}/posts`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        const posts = response.data.hits.hits.map((post) => {
          const newPost = { ...post._source, id: post._id }
          return newPost
        })
        this.setState({ posts })
      })
      .catch(error => message.error(error.message))
  }

  fetchMore = () => {
  }

  handleClick = () => {
    this.props.history.push(routes.EDIT_PROFILE)
  }

  render() {
    const { authUser, idToken } = this.props
    const { hasLoaded, user, posts } = this.state

    if (hasLoaded) {
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
                <h2>Subscriptions</h2>
                { user.tags.map(tag => (
                  <Link key={tag} to={`${routes.TAG}/${tag}`} style={{ margin: '0 7px 0 0' }}>{`#${tag}`}</Link>
                ))}
                <div className="clearfix">
                  { this.props.match.params.id === authUser.uid &&
                    <Button onClick={this.handleClick} type="primary" className="edit-btn"> Edit Profile</Button>
                  }
                </div>
              </div>
            </div>
            <div>
              <h2>Posts</h2>
              <hr />
              <Posts posts={posts} fetchMore={this.fetchMore} idToken={idToken} tags={user.tags} />
            </div>
          </div>
        </Content>
      )
    }
    return <Spinner />
  }
}

ProfilePage.propTypes = {
  history: PropTypes.PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(ProfilePage)
