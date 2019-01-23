import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Button, Tooltip } from 'antd'
import withAuthorization from '../withAuthorization'
import Posts from '../posts/Posts'
import SearchHeader from '../posts/SearchHeader'
import PostModal from '../posts/PostModal'
import axios from '../../axios'

import '../../assets/scss/WallPage.scss'

const { Content } = Layout

const INITIAL_STATE = {
  posts: [],
  modalVisible: false,
  page: 1,
  pageSize: 2,
  total: 0
}

class Wall extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    this.fetchWall()
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible })
  }

  fetchWall = () => {
    const { pageSize } = this.state
    axios.get(
      `/wall?offset=0&pagesize=${pageSize}`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        const posts = response.data.hits.hits.map((post) => {
          const newPost = { ...post._source, id: post._id }
          return newPost
        })
        this.setState(prevState => ({
          posts,
          total: response.data.hits.total,
          page: prevState.page + 1
        }))
      })
  }

  fetchMore = () => {
    const { page, pageSize } = this.state
    axios.get(
      `/wall?offset=${(page - 1) * pageSize}&pagesize=${pageSize}`,
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

  hasMore = () => this.state.page * this.state.pageSize < this.state.total

  fetchPosts = (field, query) => {
    axios.get(
      `/posts/search/${field}/${query}`,
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

  render() {
    const { modalVisible, posts } = this.state
    const { idToken, authUser } = this.props

    return (
      <React.Fragment>
        <SearchHeader authUser={authUser} idToken={idToken} handleSearch={this.fetchPosts} />
        <div>
          <Content>
            <div className="main-container">
              <Posts
                posts={posts}
                fetchMore={this.fetchMore}
                hasMore={this.hasMore}
                idToken={idToken}
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
            <PostModal
              modalVisible={modalVisible}
              setModalVisible={this.setModalVisible}
              idToken={idToken}
            />
          </Content>
        </div>
      </React.Fragment>
    )
  }
}

Wall.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(Wall)
