import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const { TextArea } = Input

const INITIAL_STATE = {
  post: false,
  code: '',
  description: '',
  tags: []
}

class PostModalForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE, handlePost: props.handlePost }
  }

  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.post !== prevState.post) {
      prevState.handlePost()
    }
    return null
  }

  hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    // Only show error after a field is touched.
    const queryError = isFieldTouched('query') && getFieldError('query')

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <h3>Description</h3>
        <Form.Item>
          {getFieldDecorator('description')(
            <TextArea onChange={this.handleChange} autosize={{ minRows: 4, maxRows: 20 }} />
          )}
        </Form.Item>
      </Form>
    )
  }
}

PostModalForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired,
  step: PropTypes.number.isRequired,
  handlePost: PropTypes.func.isRequired
}

const WrappedPostModalForm = Form.create({ name: 'query_form' })(PostModalForm)

export default WrappedPostModalForm
