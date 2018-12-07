import React from 'react'
import PropTypes from 'prop-types'
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
        <Form error={error} onSubmit={this.onSubmit}>
          <Form.Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={e => this.setState({ email: e.target.value })} />
          <Form.Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          <Message
            error
            header="Error"
            content={error ? error.message : ''}
          />
          <Button type="submit">Sign in</Button>
        </Form>
      </Container>
    )
  }
}

export default SignIn
