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
import axios from '../../axios'

const { Option } = Select

const INITIAL_STATE = {
  posts: [],
  query: '',
  tags: [],
  selectedItems: [],
  similarTags: [],
  tagSelection: false,
  user: null,
  hasLoaded: false,
  field: null
}

class QueryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  handleRadioChange = (e) => {
    e.preventDefault()
    this.setState({
      tagSelection: e.target.value === 'tags',
      field: e.target.value
    })
  }

  handleSubmit = () => {
    const { tagSelection, query, selectedItems, field } = this.state
    const { handleSearch } = this.props

    if (tagSelection && selectedItems.length !== 0) {
      handleSearch(field, encodeURIComponent(selectedItems))
    } else if (query !== '') {
      handleSearch(field, query)
    }
  }

  handleQueryChange = (e) => {
    e.preventDefault()
    this.setState({ query: e.target.value })
  }

  fetchTags = (str) => {
    axios.get(
      `/tags/${str}`,
      { headers: { Authorization: `Bearer: ${this.props.idToken}` } }
    )
      .then((response) => {
        this.setState({ similarTags: response.data })
      })
  }

  handleChange = (selectedItems) => {
    this.setState({ selectedItems })
  }

  render() {
    const { tagSelection, selectedItems, similarTags } = this.state
    const filteredOptions = similarTags.filter(o => !selectedItems.includes(o))

    return (
      <Form layout="inline">
        <Form.Item>
          <Radio.Group onChange={this.handleRadioChange}>
            <Radio value="title">Title</Radio>
            <Radio value="description">Description</Radio>
            <Radio value="code">Code</Radio>
            <Radio value="tags">Tags</Radio>
          </Radio.Group>
        </Form.Item>
        { tagSelection ? (
          <Form.Item help="">
            <Select
              mode="multiple"
              placeholder="Select tags"
              value={selectedItems}
              onSearch={this.fetchTags}
              onChange={this.handleChange}
            >
              { filteredOptions.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
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
            onClick={this.handleSubmit}
          >
            <Icon type="search" />
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

QueryForm.propTypes = {
  idToken: PropTypes.string.isRequired,
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  handleSearch: PropTypes.func.isRequired
}

export default QueryForm
