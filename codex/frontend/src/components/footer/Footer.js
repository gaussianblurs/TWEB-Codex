import React from 'react'
import { Layout } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { Footer } = Layout

const Home = () => (
  <Footer theme="dark" style={{ textAlign: 'center' }}>
    <div>
      MADE WITH <FontAwesomeIcon icon={['fa', 'heart']} className="footer-heart" /> BY
    </div>
    <div>
      <a href="https://github.com/psrochat">psrochat</a>
      &#160;&#160;
      <a href="https://github.com/gaussianblurs">gaussianblurs</a>
      &#160;&#160;
      <a href="https://github.com/Jokau">Jokau</a>
    </div>
  </Footer>
)

export default Home
