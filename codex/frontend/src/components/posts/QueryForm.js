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
  posts: [],
  query: '',
  tags: []
}

class QueryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])

  handleRadioChange = (e) => {
    e.preventDefault()
    this.setState({
      tagSelection: e.target.value === 'tag'
    })
  }

  handleSubmit = () => {

  }

  handleQueryChange = (e) => {
    e.preventDefault()
    this.setState({ query: e.target.value })
  }

  render() {
    const { tagSelection } = this.state

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
          <Radio.Group onChange={this.handleRadioChange}>
            <Radio value="title">Title</Radio>
            <Radio value="description">Description</Radio>
            <Radio value="code">Code</Radio>
            <Radio value="tag">Tag</Radio>
          </Radio.Group>
        </Form.Item>
        { tagSelection ? (
          <Form.Item help="">
            <Select mode="multiple" placeholder="Select tags">
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>
          </Form.Item>
        ) : (
          <Form.Item
            help=""
          >
            <Input
              type="text"
              placeholder="Search"
              className="query-input"
              onChange={this.handleQueryChange}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            shape="circle"
          >
            <Icon type="search" />
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

QueryForm.propTypes = {
}

export default QueryForm
