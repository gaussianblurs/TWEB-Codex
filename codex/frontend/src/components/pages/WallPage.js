import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import Posts from '../posts/Posts'

import '../../assets/scss/WallPage.scss'

const { Content } = Layout

const INITIAL_STATE = {
  posts: []
}

class Wall extends React.Component {
  static propTypes = {
    authUser: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  fetchPosts = () => {

  }

  fetchMore = () => {

  }

  render() {
    return (
      <Content>
        <div className="posts-container">
          <Posts />
        </div>
      </Content>
    )
  }
}

export default Wall
