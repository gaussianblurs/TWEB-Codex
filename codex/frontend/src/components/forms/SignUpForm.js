import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  message
} from 'antd'
import axios from '../../axios'
import { auth } from '../../firebase'
import * as routes from '../../constants/routes'

const INITIAL_STATE = {
  confirmDirty: false
}

class NormalSignUpForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          nickname,
          email,
          password
        } = values

        const {
          history
        } = this.props

        auth.doCreateUserWithEmailAndPassword(email, password)
          .then(firebaseUser => axios.post('/users', {
            uid: firebaseUser.user.uid,
            nickname,
            email
          }))
          .then(() => {
            history.push(routes.WALL)
          })
          .catch((error) => {
            message.error(error.message)
          })
      }
    })
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target
    this.setState( prevState => ({
      confirmDirty: prevState.confirmDirty || !!value
    }))
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          {...formItemLayout}
          label="Pseudonym"
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!'
            }, {
              required: true, message: 'Please input your E-mail!'
            }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!'
            }, {
              validator: this.validateToNextPassword
            }]
          })(
            <Input type="password" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!'
            }, {
              validator: this.compareToFirstPassword
            }]
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={this.handleSubmit}
          className="form-btn"
        >
            Sign Up
        </Button>
      </Form>
    )
  }
}

NormalSignUpForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired
}

const WrappedSignUpForm = Form.create({ name: 'signup_form' })(NormalSignUpForm)

export default withRouter(WrappedSignUpForm)
