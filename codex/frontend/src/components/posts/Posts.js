import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostsListItem from './PostsListItem'
import Spinner from '../utils/Spinner'

const Posts = props => (
  <div className="posts-container">
    <InfiniteScroll
      dataLength={props.total}
      next={props.fetchMore}
      hasMore={props.hasMore}
      loader={<Spinner />}
    >
      { props.posts.map(post => (
        <PostsListItem key={post.id} post={post} idToken={props.idToken} tags={props.tags} />
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
<<<<<<< HEAD
  idToken: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired
=======
  total: PropTypes.number.isRequired,
  hasMore: PropTypes.bool.isRequired,
  idToken: PropTypes.string.isRequired
>>>>>>> 1ac219b865750b9d25bd2717a4ef60ebedc586b9
}

export default Posts
