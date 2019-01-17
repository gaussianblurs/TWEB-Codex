import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostsListItem from './PostsListItem'
import Spinner from '../utils/Spinner'

const INITIAL_STATE = {
  posts: [
    {
      id: 1,
      title: 'React Proptypes',
      content: 'nbasvdjhasgdjhgashjgdhj',
      claps: 1000,
      user: '@psrochat'
    }
  ]
}

class Posts extends React.Component {
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
    const { posts } = this.state

    return (
      <div>
        <InfiniteScroll
          dataLength={1}
          next={this.fetchMore}
          hasMore={false}
          loader={<Spinner />}
        >
          { posts.map(post => (
            <PostsListItem key={post.id} post={post} />
          )) }
        </InfiniteScroll>
      </div>
    )
  }
}

export default Posts
