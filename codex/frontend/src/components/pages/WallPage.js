import React from 'react'
import { Layout, Button, Tooltip } from 'antd'
import withAuthorization from '../withAuthorization'
import Posts from '../posts/Posts'
import SearchHeader from '../posts/SearchHeader'
import PostModal from '../posts/PostModal'

import '../../assets/scss/WallPage.scss'

const { Content } = Layout

const INITIAL_STATE = {
  posts: [],
  modalVisible: false
}

class Wall extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible })
  }

  fetchPosts = () => {

  }

  fetchMore = () => {

  }

  render() {
    const { modalVisible } = this.state

    return (
      <React.Fragment>
        <SearchHeader />
        <div>
          <Content>
            <div className="main-container">
              <Posts />
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
            <PostModal modalVisible={modalVisible} setModalVisible={this.setModalVisible} />
          </Content>
        </div>
      </React.Fragment>
    )
  }
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(Wall)
