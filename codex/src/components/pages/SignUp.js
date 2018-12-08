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
          <Form.Input label="Full name" type="text" name="name" placeholder="Enter your full name" value={name} onChange={this.handleUserInput} />
          <Form.Input label="Email" type="email" name="email" placeholder="Enter your email" value={email} onChange={this.handleUserInput} />
          <Form.Input label="Password" type="password" name="passwordOne" placeholder="Enter your password" value={passwordOne} onChange={this.handleUserInput} />
          <Form.Input label="Confirm password" type="password" name="passwordTwo" placeholder="Enter your password again" value={passwordTwo} onChange={this.handleUserInput} />
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
