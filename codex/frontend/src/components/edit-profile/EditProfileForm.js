import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Button
} from 'antd'

class NormalEditProfileForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <h2>Nickname</h2>
        <Form.Item>
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input a nickname !' }]
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="nickname" />
          )}
        </Form.Item>
        <Form.Item>
          <div className="clearfix">
            <Button type="primary" htmlType="submit" className="submit-btn">
              Submit Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

NormalEditProfileForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired
}

const WrappedEditProfileForm = Form.create({ name: 'edit_profile' })(NormalEditProfileForm)

export default WrappedEditProfileForm
