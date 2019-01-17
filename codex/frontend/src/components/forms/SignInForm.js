import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Button,
  message
} from 'antd'
import { auth } from '../../firebase'
import * as routes from '../../constants/routes'

class NormalSignInForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          email,
          password
        } = values

        const {
          history
        } = this.props

        auth.doSignInWithEmailAndPassword(email, password)
          .then(() => {
            history.push(routes.WALL)
          })
          .catch((error) => {
            message.error(error.message)
          })
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
        <Form.Item>
          { getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={this.handleSubmit}
            className="form-btn"
          >
            Sign In
          </Button>
          <Link to={routes.FORGOT_PASSWORD}>Forgot your password ?</Link>
        </Form.Item>
        <span>Don&#39;t have an account yet?&#160;</span>
        <Link to={routes.SIGN_UP}>Sign Up</Link>
      </Form>
    )
  }
}

NormalSignInForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired,
  history: PropTypes.PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

const WrappedSignInForm = Form.create({ name: 'singin_form' })(NormalSignInForm)

export default WrappedSignInForm
