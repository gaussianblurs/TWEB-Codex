import React from 'react'
import Main from './components/Main'
import Header from './components/header/Header'
import withAuthentication from './components/withAuthentication'

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

export default withAuthentication(App)
