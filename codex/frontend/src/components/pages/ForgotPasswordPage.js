import React from 'react'
import { Layout } from 'antd'
import ForgotPasswordForm from '../forms/ForgotPasswordForm'

import '../../assets/scss/FormPages.scss'

const { Content } = Layout

const INITIAL_STATE = {
  verticalPos: '',
  mainHeight: ''
}

class SignInPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
    this.updateDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
    document.body.style.overflow = 'scroll'
  }

  updateDimensions = () => {
    const headerHeight = 64
    const footerHeight = 90
    const windowHeight = window.innerHeight
    const containerHeight = this.container.clientHeight

    // Set container vertical position and main container height
    const verticalPos = (
      Math.max(((windowHeight - headerHeight - footerHeight) / 2) +
        headerHeight - (containerHeight / 2), headerHeight + 50))
    const mainHeight = (
      Math.max(windowHeight - headerHeight - footerHeight, containerHeight + 100)
    )

    // Enable or disable scroll
    if (verticalPos > headerHeight + 50) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }

    // State
    this.setState({ verticalPos, mainHeight })
  }

  render() {
    const { verticalPos, mainHeight } = this.state

    return (
      <Content style={{ minHeight: `${mainHeight}px` }}>
        <div
          ref={(elem) => { this.container = elem }}
          style={{ top: `${verticalPos}px` }}
          className="form-container"
        >
          <div className="form-title">
            <h2>Forgot My Password</h2>
          </div>
          <ForgotPasswordForm />
        </div>
      </Content>
    )
  }
}

export default SignInPage
