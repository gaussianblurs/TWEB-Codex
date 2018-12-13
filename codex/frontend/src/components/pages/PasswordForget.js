import React, { Component } from 'react'
import { Container, Button, Form, Message } from 'semantic-ui-react'
import { auth } from '../../firebase'

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  email: '',
  error: null
}

class PasswordForget extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { email } = this.state

    auth.doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
      })
      .catch((error) => {
        this.setState(byPropKey('error', error))
      })

    event.preventDefault()
  }

  render() {
    const {
      email,
      error
    } = this.state

    const isInvalid = email === ''

    return (
      <Container>
        <h1>Reset Password</h1>
        <Form error={!!error} onSubmit={this.onSubmit}>
          <Form.Input
            label="Email"
            value={email}
            onChange={event => this.setState(byPropKey('email', event.target.value))}
            type="email"
            placeholder="Email Address"
          />
          <Message
            error
            header="Error"
            content={error ? error.message : ''}
          />
          <Button disabled={isInvalid} type="submit">
            Reset My Password
          </Button>
        </Form>
      </Container>
    )
  }
}

export default PasswordForget
