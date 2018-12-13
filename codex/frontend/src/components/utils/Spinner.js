import React from 'react'
import { ClipLoader } from 'react-spinners'

const Spinner = () => (
  <div className="text-center my-3">
    <ClipLoader
      sizeUnit="px"
      size={30}
      color="#7bed9f"
      loading
    />
  </div>
)

export default Spinner
