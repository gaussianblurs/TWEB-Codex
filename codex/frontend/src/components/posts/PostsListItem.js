import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow'

const PostsListItem = props => (
  <div className="clearfix">
    <Avatar size={64} icon="user" className="avatar" />
    <div className="post">
      <h2>{props.post.title}</h2>
      <div className="description">{props.post.description}</div>
      <SyntaxHighlighter className="code" language="javascript" style={tomorrow}>{props.post.code}</SyntaxHighlighter>
    </div>
  </div>
)

PostsListItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    claps: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired
  }).isRequired
}

export default PostsListItem
