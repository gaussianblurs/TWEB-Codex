import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Button, Tooltip, message } from 'antd'
import withAuthorization from '../withAuthorization'
import Posts from '../posts/Posts'
import axios from '../../axios'

import '../../assets/scss/WallPage.scss'

const { Content } = Layout

const INITIAL_STATE = {
  posts: [],
  tags: []
}

class TagPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts = () => {
    axios.get(
      `/posts/search/tags/${this.props.match.params.tag}`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        const posts = response.data.hits.hits.map((post) => {
          const newPost = { ...post._source, id: post._id }
          return newPost
        })
        this.setState({ posts })
      })
  }

  fetchUser = () => {
    axios.get(`/users/${this.props.authUser.uid}`, {
      headers: { Authorization: `Bearer: ${this.props.idToken}` }
    })
      .then((response) => {
        this.setState({
          tags: response.data.tags
        })
      })
      .catch(error => message.error(error.message))
  }

  fetchMore = () => {

  }

  render() {
    const { posts, tags } = this.state
    const { idToken, authUser } = this.props

    return (
      <Content>
        <div className="main-container">
          <Posts posts={posts} fetchMore={this.fetchMore} idToken={idToken} tags={tags} />
        </div>
      </Content>
    )
  }
}

TagPage.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      tag: PropTypes.string.isRequired
    })
  }).isRequired
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(TagPage)
