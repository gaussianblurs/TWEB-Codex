import React from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Form,
  Button,
  Message
} from 'semantic-ui-react'
import { auth } from '../../firebase'
import * as routes from '../../constants/routes'
import '../../assets/scss/SignUp.scss'

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class SignUp extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  handleUserInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  isValidForm = () => {
    const {
      name,
      email,
      passwordOne,
      passwordTwo
    } = this.state
    return name !== '' && email !== '' && passwordOne !== '' && passwordOne === passwordTwo
  }

  onSubmit = (event) => {
    event.preventDefault()

    const {
      name,
      email,
      passwordOne
    } = this.state

    const {
      history
    } = this.props

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((user) => { // eslint-disable-line no-unused-vars
        this.setState({ ...INITIAL_STATE })
        history.push(routes.HOME)
      })
      .catch((error) => {
        this.setState({
          error
        })
      })
  }

  render() {
    const {
      name,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state

    return (
      <Container>
        <h1>Sign up</h1>
        <Form error={!!error} onSubmit={this.onSubmit}>
          <Form.Input label="Full name" placeholder="Enter your full name" type="text" name="name" value={name} onChange={this.handleUserInput} />
          <Form.Input label="Email" placeholder="Enter your email" type="email" name="email" value={email} onChange={this.handleUserInput} />
          <Form.Input label="Password" placeholder="Enter your password" type="password" name="passwordOne" value={passwordOne} onChange={this.handleUserInput} />
          <Form.Input label="Confirm password" placeholder="Enter your password again" type="password" name="passwordTwo" value={passwordTwo} onChange={this.handleUserInput} />
          <Message
            error
            header="Error"
            content={error ? error.message : ''}
          />
          <Button type="submit" disabled={!this.isValidForm()}>Sign up</Button>
        </Form>
      </Container>
    )
  }
}

export default SignUp
