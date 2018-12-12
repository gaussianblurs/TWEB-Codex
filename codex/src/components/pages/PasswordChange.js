import React from 'react'
import { Container, Form, Button, Message } from 'semantic-ui-react'
import { auth } from '../../firebase'
import withAuthorization from '../withAuthorization'

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class PasswordChange extends React.Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error
    } = this.state

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === ''

    return (
      <Container>
        <Form error={!!error} onSubmit={this.onSubmit}>
          <Form.Input
            value={passwordOne}
            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            placeholder="New Password"
          />
          <Form.Input
            value={passwordTwo}
            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            placeholder="Confirm New Password"
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

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(PasswordChange)
