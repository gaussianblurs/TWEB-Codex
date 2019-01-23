import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Steps, Button, message } from 'antd'
import PostModalForm from './PostModalForm'

const { Step } = Steps

const INITIAL_STATE = {
  current: 0,
  post: false
}

class PostModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  next = () => {
    this.setState(prevState => ({
      current: prevState.current + 1
    }))
  }

  prev = () => {
    this.setState(prevState => ({
      current: prevState.current - 1
    }))
  }

  handleDone = () => {
    // Will trigger post from child component PostModalForm
    this.setState({
      post: true
    })
  }

  handlePost = (title, description, content, tags) => {
    message.success('Post successfully sent!')
    console.log(title)
    console.log(description)
    console.log(content)
    console.log(tags)
    this.props.setModalVisible(false)
    this.setState({
      post: false,
      current: 0
    })
  }

  footer = () => {
    const { current } = this.state
    return (
      <div className="steps-action">
        {
          current > 0 &&
          (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )
        }
        {
          current + 1 < 3 &&
          <Button type="primary" onClick={() => this.next()}>Next</Button>
        }
        {
          current + 1 === 3 &&
          <Button type="primary" onClick={this.handleDone}>Post</Button>
        }
      </div>
    )
  }

  formContent = () => {
    const { current, post } = this.state
    return (<PostModalForm post={post} step={current} handlePost={this.handlePost} />)
  }

  render() {
    const { current } = this.state
    const { modalVisible } = this.props

    return (
      <Modal
        title="Post"
        centered
        visible={modalVisible}
        onCancel={() => this.props.setModalVisible(false)}
        onOk={() => this.props.setModalVisible(false)}
        width={800}
        footer={this.footer()}
      >
        <Steps current={current}>
          <Step title="Title & Tags" />
          <Step title="Description" />
          <Step title="Code" />
        </Steps>
        <div className="steps-content">
          { this.formContent() }
        </div>
      </Modal>
    )
  }
}

PostModal.propTypes = {
  setModalVisible: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired
}

export default PostModal
