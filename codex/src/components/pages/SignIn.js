import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Container,
  Form,
  Button,
  Message
} from 'semantic-ui-react'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
}

class SignIn extends React.Component {
  static propTypes = {
    history: PropTypes.PropTypes.shape({
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
      email,
      password
    } = this.state
    return email !== '' && password !== ''
  }

  onSubmit = (event) => {
    event.preventDefault()
    const {
      email,
      password
    } = this.state

    const {
      history
    } = this.props

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
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
    const { email, password, error } = this.state
    return (
      <Container>
        <h1>Sign in</h1>
        <Form error={!!error} onSubmit={this.onSubmit}>
          <Form.Input label="Email" placeholder="Enter your email" type="email" name="email" value={email} onChange={this.handleUserInput} />
          <Form.Input label="Password" placeholder="Enter your password" type="password" name="password" value={password} onChange={this.handleUserInput} />
          <p>Haven&apos;t joined yet ? <Link to={routes.SIGN_UP}>Sign up !</Link></p>
          <Message
            error
            header="Error"
            content={error ? error.message : ''}
          />
          <Button type="submit" disabled={!this.isValidForm()}>Sign in</Button>
        </Form>
      </Container>
    )
  }
}

export default SignIn
