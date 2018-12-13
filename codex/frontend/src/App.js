import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import Main from './components/Main'
import MenuHeader from './components/header/MenuHeader'
import withAuthentication from './components/withAuthentication'
import AuthUserContext from './components/AuthUserContext'
import './assets/scss/App.scss'

const App = () => (
  <AuthUserContext.Consumer>
    {
      ({ authUser }) => (
        <BrowserRouter>
          <div>
            <MenuHeader authUser={authUser} />
            <Main authUser={authUser} />
          </div>
        </BrowserRouter>
      )
    }
  </AuthUserContext.Consumer>
)

export default withAuthentication(App)
