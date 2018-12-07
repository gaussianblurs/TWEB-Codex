import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import Main from './components/Main'
import Header from './components/header/Header'
import withAuthentication from './components/withAuthentication'

const App = () => (
  <BrowserRouter>
    <div>
      <Header />
      <Main />
    </div>
  </BrowserRouter>
)

export default withAuthentication(App)
