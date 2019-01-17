import React from 'react'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostsListItem from './PostsListItem'
import Spinner from '../utils/Spinner'

const INITIAL_STATE = {
  posts: [
    {
      id: 1,
      title: 'When to Use Context',
      description:
      'Context is designed to share data that can be considered “global” \
      for a tree of React components, such as the current authenticated user, \
      theme, or preferred language. For example, in the code below we manually \
      thread through a “theme” prop in order to style the Button component:',
      code:
      'class App extends React.Component { \n \
        render() { \n \
          return <Toolbar theme="dark" />; \n \
        } \n \
      }',
      content: 'nbasvdjhasgdjhgashjgdhj',
      claps: 1000,
      user: '@psrochat'
    },
    {
      id: 1,
      title: 'When to Use Context',
      description:
      'Context is designed to share data that can be considered “global” \
      for a tree of React components, such as the current authenticated user, \
      theme, or preferred language. For example, in the code below we manually \
      thread through a “theme” prop in order to style the Button component:',
      code:
      'class App extends React.Component { \n \
        render() { \n \
          return <Toolbar theme="dark" />; \n \
        } \n \
      }',
      content: 'nbasvdjhasgdjhgashjgdhj',
      claps: 1000,
      user: '@psrochat'
    },
    {
      id: 1,
      title: 'When to Use Context',
      description:
      'Context is designed to share data that can be considered “global” \
      for a tree of React components, such as the current authenticated user, \
      theme, or preferred language. For example, in the code below we manually \
      thread through a “theme” prop in order to style the Button component:',
      code:
      'class App extends React.Component { \n \
        render() { \n \
          return <Toolbar theme="dark" />; \n \
        } \n \
      }',
      content: 'nbasvdjhasgdjhgashjgdhj',
      claps: 1000,
      user: '@psrochat'
    },
    {
      id: 1,
      title: 'When to Use Context',
      description:
      'Context is designed to share data that can be considered “global” \
      for a tree of React components, such as the current authenticated user, \
      theme, or preferred language. For example, in the code below we manually \
      thread through a “theme” prop in order to style the Button component:',
      code:
      'class App extends React.Component { \n \
        render() { \n \
          return <Toolbar theme="dark" />; \n \
        } \n \
      }',
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
