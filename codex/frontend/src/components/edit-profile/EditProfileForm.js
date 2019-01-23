import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  message
} from 'antd'
import * as routes from '../../constants/routes'
import axios from '../../axios'

const { Option } = Select

const INITIAL_STATE = {
  similarTags: [],
  selectedItems: [],
  nickname: ''
}

class NormalEditProfileForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    this.setState({
      selectedItems: this.props.user.tags,
      nickname: this.props.user.nickname
    }, () => this.fetchTags(''))
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

  handleSubmit = () => {
    const { user } = this.props
    const { nickname, selectedItems } = this.state

    if (user.nickname === nickname && JSON.stringify(user.tags) === JSON.stringify(selectedItems)) {
      this.props.history.push(routes.PROFILE)
    } else {
      axios.get(`/users/nickname/${nickname}`)
        .then(response => response.data)
        .then((userExists) => {
          if (userExists && nickname !== user.nickname) {
            message.error('Nickname is already taken !')
          } else {
            axios.put('/users', {
              nickname,
              tags: encodeURIComponent(selectedItems)
            }, {
              headers: { Authorization: `Bearer: ${this.props.idToken}` }
            })
              .then(() => {
                message.success('Success !')
                this.props.history.push(routes.PROFILE)
              })
              .catch(error => message.error(error.message))
          }
        })
        .catch(error => message.error(error.message))
    }
  }

  handleChange = (selectedItems) => {
    this.setState({ selectedItems })
  }

  handleNicknameChange = (e) => {
    e.preventDefault()
    this.setState({
      nickname: e.target.value
    })
  }

  render() {
    const { selectedItems, similarTags } = this.state
    const { user } = this.props
    const filteredOptions = similarTags.filter(o => !selectedItems.includes(o))

    return (
      <Form className="login-form">
        <h2>Nickname</h2>
        <Form.Item>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder={user.nickname}
            onChange={this.handleNicknameChange}
          />
        </Form.Item>
        <h2>Subscriptions</h2>
        <Form.Item
          help=""
        >
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
        <Form.Item>
          <div className="clearfix">
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              onClick={this.handleSubmit}
            >
              Submit Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

NormalEditProfileForm.propTypes = {
  history: PropTypes.PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

const WrappedEditProfileForm = Form.create({ name: 'edit_profile' })(NormalEditProfileForm)

export default withRouter(WrappedEditProfileForm)
