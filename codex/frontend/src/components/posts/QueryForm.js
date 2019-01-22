import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Icon,
  Input,
  Radio,
  Button,
  Select
} from 'antd'

const { Option } = Select

const INITIAL_STATE = {
  posts: []
}

class QueryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    // To disable submit button at the beginning.
    this.props.form.validateFields()
  }

  hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])

  handleRadioChange = (e) => {
    e.preventDefault()
    this.setState({
      tagSelection: e.target.value === 'tag'
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { tagSelection } = this.state
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    // Only show error after a field is touched.
    const queryError = isFieldTouched('query') && getFieldError('query')

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('radio-group')(
            <Radio.Group onChange={this.handleRadioChange}>
              <Radio value="title">Tag</Radio>
              <Radio value="description">Description</Radio>
              <Radio value="code">Code</Radio>
              <Radio value="tag">Tag</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        { tagSelection ? (
          <Form.Item
            label="Tags"
            help=""
          >
            {getFieldDecorator('tags', {
              rules: [
                { required: false, type: 'array' }
              ]
            })(
              <Select mode="multiple" placeholder="Select tags">
                <Option value="red">Red</Option>
                <Option value="green">Green</Option>
                <Option value="blue">Blue</Option>
              </Select>
            )}
          </Form.Item>
        ) : (
          <Form.Item
            validateStatus={queryError ? 'error' : ''}
            help=""
            hasFeedback
          >
            {getFieldDecorator('query', {
              rules: [{ required: false }]
            })(
              <Input type="text" placeholder="Search" className="query-input" />
            )}
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            shape="circle"
            disabled={this.hasErrors(getFieldsError())}
          >
            <Icon type="search" />
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

QueryForm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsError: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired
  }).isRequired
}

const WrappedQueryForm = Form.create({ name: 'query_form' })(QueryForm)

export default WrappedQueryForm
