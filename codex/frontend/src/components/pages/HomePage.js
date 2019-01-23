import React from 'react'
import { Layout } from 'antd'

import logo from '../../assets/images/logo.svg'
import '../../assets/scss/HomePage.scss'

const { Content } = Layout

const Home = () => (
  <Content className="main-container">
    <div className="home-logo">
      <img className="img" height={150} src={logo} alt="home-logo" />
      <div className="text">
        <div className="title">CODEX</div>
        <div className="subtitle">Share your best lines of code !</div>
      </div>
    </div>
  </Content>
)

export default Home
