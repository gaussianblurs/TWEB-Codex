import React from 'react'
import { ClipLoader } from 'react-spinners'
import { Layout } from 'antd'

const { Content } = Layout

const Spinner = () => (
  <Content className="spinner-container">
    <ClipLoader
      sizeUnit="px"
      size={30}
      color="#091B2C"
      loading
    />
  </Content>
)

export default Spinner
