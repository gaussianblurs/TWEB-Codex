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
      hasMore={false}
      loader={<Spinner />}
    >
      { props.posts.map(post => (
        <PostsListItem key={post.id} post={post} />
      )) }
    </InfiniteScroll>
  </div>
)

Posts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      creator_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired,
      claps: PropTypes.number.isRequired,
      user: PropTypes.string.isRequired,
      creation_time: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  fetchMore: PropTypes.func.isRequired
}

export default Posts
