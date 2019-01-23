import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tag,
  Icon,
  Tooltip
} from 'antd'

const { TextArea } = Input

const INITIAL_STATE = {
  post: false,
  content: '',
  description: '',
  tags: [],
  inputVisible: false,
  inputValue: ''
}

class PostModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE, handlePost: props.handlePost }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.post !== prevState.post) {
      const { tags, content, description, title } = prevState
      prevState.handlePost(title, description, content, tags)
    }
    return null
  }

  handleClose = (removedTag) => {
    this.setState(prevState => ({ tags: prevState.tags.filter(tag => tag !== removedTag) }))
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    let { tags } = this.state
    const { inputValue } = this.state

    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    })
  }

  handleDescriptionChange = (e) => {
    e.preventDefault()
    this.setState({
      description: e.target.value
    })
  }

  handleContentChange = (e) => {
    e.preventDefault()
    this.setState({
      content: e.target.value
    })
  }

  handleTitleChange = (e) => {
    e.preventDefault()
    this.setState({
      title: e.target.value
    })
  }

  getCurrentField = () => {
    const { tags, inputVisible, inputValue } = this.state

    if (this.props.step === 0) {
      return (
        <React.Fragment>
          <h3>Title</h3>
          <Form.Item>
            <Input
              ref={(node) => { this.input = node }}
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </Form.Item>
          <h3>Tags</h3>
          <Form.Item
            help=""
          >
            <div>
              {tags.map((tag, index) => {
                const isLongTag = tag.length > 20
                const tagElem = (
                  <Tag key={tag} closable={index !== 0} afterClose={() => this.handleClose(tag)}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                )
                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  onClick={this.showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> New Tag
                </Tag>
              )}
            </div>
          </Form.Item>
        </React.Fragment>
      )
    }
    if (this.props.step === 1) {
      return (
        <React.Fragment>
          <h3>Description</h3>
          <Form.Item>
            <TextArea
              value={this.state.description}
              onChange={this.handleDescriptionChange}
              autosize={{ minRows: 4, maxRows: 20 }}
            />
          </Form.Item>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <h3>Code</h3>
        <Form.Item>
          <TextArea
            value={this.state.content}
            onChange={this.handleContentChange}
            autosize={{ minRows: 4, maxRows: 20 }}
          />
        </Form.Item>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Form layout="vertical">
        { this.getCurrentField() }
      </Form>
    )
  }
}

PostModalForm.propTypes = {
  step: PropTypes.number.isRequired,
  handlePost: PropTypes.func.isRequired
}

const WrappedPostModalForm = Form.create({ name: 'query_form' })(PostModalForm)

export default WrappedPostModalForm
