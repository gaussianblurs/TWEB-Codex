import React from 'react'
import PropTypes from 'prop-types'
import QueryForm from './QueryForm'

const SearchHeader = props => (
  <div className="query-header clearfix">
    <div className="query-form-container">
      <QueryForm
        authUser={props.authUser}
        idToken={props.idToken}
        handleSearch={props.handleSearch}
      />
    </div>
  </div>
)

SearchHeader.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired
}

export default SearchHeader
