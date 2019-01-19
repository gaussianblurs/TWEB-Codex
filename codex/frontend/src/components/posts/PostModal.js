import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Steps, Button, Input, message } from 'antd'

const { Step } = Steps
const { TextArea } = Input

const INITIAL_STATE = {
  current: 0
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
    message.success('Post successfully sent!')
    this.props.setModalVisible(false)
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
          <h3>Description</h3>
          <TextArea autosize={{ minRows: 4, maxRows: 20 }} />
          <h3>Code</h3>
          <TextArea autosize={{ minRows: 4, maxRows: 20 }} />
        </div>
      </Modal>
    )
  }
}

PostModal.propTypes = {
  setModalVisible: PropTypes.func.isRequired,
  modalVisible: PropTypes.number.isRequired
}

export default PostModal
