import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Avatar, Button, Badge } from 'antd'
import TimeAgo from 'react-timeago'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow'
import { FullClapIcon, OutlineClapIcon } from './utils/Icons'

const INITIAL_STATE = {
  totalClaps: 100,
  totalClapsBadge: 100,
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

  computeTotal = () => {
    this.setState(prevState => ({
      totalClapsBadge: prevState.totalClaps + prevState.claps + prevState.clapsInc,
      claps: prevState.claps + prevState.clapsInc,
      clapsInc: 0
    }))
  }

  dismissCounter = (callback) => {
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
            <Link to="/" style={{ margin: '0 5px 0 0' }}>#react</Link>
            <Link to="/">#context</Link>
          </div>
          <p className="description">{post.description}</p>
          <div className="code-container">
            <SyntaxHighlighter className="code" language="javascript" style={tomorrow}>
              {post.code}
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
            Posted&nbsp;<TimeAgo date='Feb 1, 1966' /> by <Link to="/">@psrochat</Link>
          </p>
        </div>
      </div>
    )
  }
}

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
