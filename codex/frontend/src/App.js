import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import { Layout } from 'antd'
import Main from './components/Main'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import withAuthentication from './components/withAuthentication'
import AuthUserContext from './components/AuthUserContext'

library.add(
  faHeart
)

const App = () => (
  <AuthUserContext.Consumer>
    {
      ({ authUser, user, idToken }) => (
        <BrowserRouter>
          <Layout>
            <Header authUser={authUser} user={user} />
            <Main authUser={authUser} user={user} idToken={idToken} />
            <Footer />
          </Layout>
        </BrowserRouter>
      )
    }
  </AuthUserContext.Consumer>
)

export default withAuthentication(App)
