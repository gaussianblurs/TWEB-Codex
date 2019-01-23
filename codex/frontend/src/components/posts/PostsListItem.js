import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Avatar, Button, Badge } from 'antd'
import TimeAgo from 'react-timeago'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow'
import { OutlineClapIcon } from './utils/Icons'
import axios from '../../axios'

const INITIAL_STATE = {
  totalClaps: 0,
  totalClapsBadge: 0,
  claps: 0,
  clapsInc: 0,
  clapsVisible: false,
  clapsLimit: false,
  timeOuts: []
}

class PostsListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    console.log(this.props)
    const { claps } = this.props.post
    this.setState({
      totalClaps: claps,
      totalClapsBadge: claps
    })
  }

  computeTotal = () => {
    this.setState(prevState => ({
      totalClapsBadge: prevState.totalClaps + prevState.claps + prevState.clapsInc,
      claps: prevState.claps + prevState.clapsInc,
      clapsInc: 0
    }))
  }

  dismissCounter = (callback) => {
    axios.put(
      `/posts/${this.props.post.id}/update-claps`,
      { claps: this.state.clapsInc },
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
    this.setState({
      clapsVisible: false
    }, callback)
  }

  handleClaps = () => {
    const { timeOuts, claps, clapsInc } = this.state
    timeOuts.forEach(clearTimeout)
    const timeOut = setTimeout(() => {
      this.setState({
        clapsLimit: claps + clapsInc + 1 > 20
      }, () => this.dismissCounter(this.computeTotal))
    }, 1000)
    this.setState(prevState => ({
      clapsInc: claps + clapsInc < 20 ? prevState.clapsInc + 1 : prevState.clapsInc,
      clapsVisible: true,
      timeOuts: [...prevState.timeOuts, timeOut]
    }))
  }

  displayCounter = () => {
    const { clapsLimit, clapsVisible, clapsInc } = this.state
    if (clapsVisible) {
      if (clapsLimit) {
        return (<div className="claps-inc">No more claps !</div>)
      }
      return (<div className="claps-inc">+{clapsInc}</div>)
    }
    return (<div />)
  }

  render() {
    const { post } = this.props
    const { totalClapsBadge } = this.state

    return (
      <div className="clearfix">
        <Avatar size={64} icon="user" className="avatar" />
        <div className="post">
          <h2>{post.title}</h2>
          <div className="tags">
            { post.tags.map(tag => (
              <Link key={tag} to="/" style={{ margin: '0 7px 0 0' }}>{`#${tag}`}</Link>
            ))}
          </div>
          <p className="description">{post.description}</p>
          <div className="code-container">
            <SyntaxHighlighter className="code" language="javascript" style={tomorrow}>
              {post.content}
            </SyntaxHighlighter>
          </div>
          <div className="claps">
            <div className="claps-btn">
              <Badge count={totalClapsBadge} overflowCount={10000}>
                <Button shape="circle" size="large" onClick={this.handleClaps}>
                  <OutlineClapIcon className="btn-icon" />
                </Button>
              </Badge>
            </div>
            { this.displayCounter() }
          </div>
          <p className="post-date">
            Posted&nbsp;<TimeAgo date={post.creation_time} /> by <Link to="/">@{post.author}</Link>
          </p>
        </div>
      </div>
    )
  }
}

PostsListItem.propTypes = {
  post: PropTypes.shape({
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
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

export default PostsListItem
