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
  tags: [],
  page: 1,
  pageSize: 5,
  total: 0
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
    const { pageSize } = this.state
    axios.get(
      `/posts/search/tags/${this.props.match.params.tag}?offset=0&pagesize=${pageSize}`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        const posts = response.data.hits.hits.map((post) => {
          const newPost = { ...post._source, id: post._id }
          return newPost
        })
        this.setState(prevState => ({
          posts,
          page: prevState.page + 1,
          total: response.data.hits.total
        }))
      })
  }

  fetchMore = () => {
    const { page, pageSize } = this.state
    axios.get(
      `/posts/search/tags/${this.props.match.params.tag}?offset=${(page - 1) * pageSize}&pagesize=${pageSize}`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        const newPosts = response.data.hits.hits.map((post) => {
          const newPost = { ...post._source, id: post._id }
          return newPost
        })
        this.setState(prevState => ({
          posts: [...prevState.posts, ...newPosts],
          page: prevState.page + 1
        }))
      })
  }

  hasMore = () => (this.state.page - 1) * this.state.pageSize < this.state.total

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

  render() {
    const { posts, tags, total } = this.state
    const { idToken } = this.props

    return (
      <Content>
        <div className="main-container">
          <Posts
            posts={posts}
            total={total}
            fetchMore={this.fetchMore}
            hasMore={this.hasMore()}
            idToken={idToken}
            tags={tags}
          />
        </div>
        <div className="post-btn-container clearfix">
          <Tooltip placement="left" title="Create Post">
            <Button
              type="primary"
              className="post-btn"
              onClick={() => this.setModalVisible(true)}
              shape="circle"
              icon="plus"
            />
          </Tooltip>
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
