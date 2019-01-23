import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostsListItem from './PostsListItem'
import Spinner from '../utils/Spinner'

const Posts = props => (
  <div className="posts-container">
    <InfiniteScroll
      dataLength={1}
      next={props.fetchMore}
      hasMore={props.hasMore}
      loader={<Spinner />}
    >
      { props.posts.map(post => (
        <PostsListItem key={post.id} post={post} idToken={props.idToken} />
      )) }
    </InfiniteScroll>
  </div>
)

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      creator_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired,
      claps: PropTypes.number.isRequired,
      creation_time: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  fetchMore: PropTypes.func.isRequired,
  hasMore: PropTypes.func.isRequired,
  idToken: PropTypes.string.isRequired
}

export default Posts
