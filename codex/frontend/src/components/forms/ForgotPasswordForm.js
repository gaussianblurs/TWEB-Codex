import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Button
} from 'antd'
import * as routes from '../../constants/routes'
import '../../assets/scss/FormPages.scss'

class NormalForgotPasswordForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-console
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!'
            }, {
              required: true, message: 'Please input your E-mail!'
            }]
          })(
            <Input prefix={<div style={{ fontSize: '15px', color: 'rgba(0,0,0,.25)' }}>@</div>} placeholder="Email" />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit" className="form-btn">
          Reset Password
        </Button>
      </Form>
    )
  }
}

NormalForgotPasswordForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired
}

const WrappedForgotPasswordForm = Form.create({ name: 'forgot_password_form' })(NormalForgotPasswordForm)

export default WrappedForgotPasswordForm
