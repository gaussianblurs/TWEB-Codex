import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow'

const codeString = (
  'class App extends React.Component { \n \
    render() { \n \
      return <Toolbar theme="dark" />; \n \
    } \n \
  }'
)

const description = 'Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a “theme” prop in order to style the Button component:'

const PostsListItem = props => (
  <div className="clearfix">
    <Avatar size={64} icon="user" className="avatar" />
    <div className="post">
      <h2>When to Use Context</h2>
      <div className="description">{description}</div>
      <SyntaxHighlighter className="code" language="javascript" style={tomorrow}>{codeString}</SyntaxHighlighter>
    </div>
  </div>
)

PostsListItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    claps: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired
  }).isRequired
}

export default PostsListItem
