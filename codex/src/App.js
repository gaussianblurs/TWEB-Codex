import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import Main from './components/Main'
import MenuHeader from './components/header/MenuHeader'
import withAuthentication from './components/withAuthentication'
import './assets/scss/App.scss'

const App = () => (
  <BrowserRouter>
    <div>
      <MenuHeader />
      <Main />
    </div>
  </BrowserRouter>
)

export default withAuthentication(App)
