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
        <Form error>
          <Form.Input label="Full name" type="text" placeholder="Enter your full name" value={name} onChange={e => this.setState({ name: e.target.value })} />
          <Form.Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={e => this.setState({ email: e.target.value })} />
          <Form.Input label="Password" type="password" placeholder="Enter your password" value={passwordOne} onChange={e => this.setState({ passwordOne: e.target.value })} />
          <Form.Input label="Confirm password" type="password" placeholder="Enter your password again" value={passwordTwo} onChange={e => this.setState({ passwordTwo: e.target.value })} />
          <Message
            error
            header="Error"
            content={error ? error.message : ''}
          />
          <Button type="submit">Sign up</Button>
        </Form>
      </Container>
    )
  }
}

export default SignUp
