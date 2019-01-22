import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Avatar, Button, Modal, message } from 'antd'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import Spinner from '../utils/Spinner'
import EditProfileForm from '../edit-profile/EditProfileForm'
import withAuthorization from '../withAuthorization'
import axios from '../../axios'

import '../../assets/scss/ProfilePage.scss'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

const { Content } = Layout

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileRename,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageValidateSize,
  FilePondPluginImageResize,
  FilePondPluginImageCrop
)

const INITIAL_STATE = {
  hasLoaded: false,
  user: null
}

class EditProfilePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    axios.get(`/users/${this.props.authUser.uid}`, {
      headers: { Authorization: `Bearer: ${this.props.idToken}` }
    })
      .then(response => this.setState({
        user: response.data,
        hasLoaded: true
      }))
      .catch(error => message.error(error))
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { hasLoaded, user } = this.state
    const server = {
      url: 'http://localhost:8081',
      process: {
        url: '/collaborator/updateimage',
        method: 'POST',
        withCredentials: false,
        headers: { Authorization: `Bearer ${this.props.idToken}` },
        timeout: 7000,
        onload: null,
        onerror: null,
        ondata: null,
        fetch: null,
        revert: null
      }
    }
    if (hasLoaded) {
      return (
        <Content>
          <div className="main-container profile">
            <div>
              <h2>Edit Profile</h2>
              <hr />
            </div>
            <div className="clearfix">
              <div className="avatar">
                <Avatar size={150} icon="user" className="picture" />
                <Button
                  onClick={this.showModal}
                  className="picture-btn"
                >
                  Change Picture
                </Button>
              </div>
              <div className="infos">
                <EditProfileForm user={user} idToken={this.props.idToken} />
              </div>
            </div>
          </div>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <FilePond
              server={server}
              name="images"
              instantUpload="false"
              allowFileSizeValidation
              maxFileSize="1MB"
              labelMaxFileSizeExceeded="File is too large"
              labelMaxFileSize="Maximum file size is 1MB"
              allowFileTypeValidation
              acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
              allowFileRename
              fileRenameFunction={file => `${user.nickname}${file.extension}`}
              allowImagePreview
              allowImageEdit
              allowImageCrop
              imageCropAspectRatio="1:1"
              allowImageResize
              imageResizeTargetWidth="200"
              imageResizeTargetHeight="200"
              imageResizeMode="fill"
              imageResizeUpscale
              allowImageValidateSize
              imageValidateSizeMinWidth="100"
              imageValidateSizeMinHeight="100"
              allowImageTransform
              imageTransformOutputMimeType="image/png"
              imageTransformOutputQuality="100"
              imageTransformOutputQualityMode="always"
              imageTransformClientTransforms={['resize', 'crop']}
              onprocessfile={this.uploadDone}
            />
          </Modal>
        </Content>
      )
    }
    return <Spinner />
  }
}

EditProfilePage.propTypes = {
  authUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  idToken: PropTypes.string.isRequired
}

const authCondition = authUser => !!authUser

export default withAuthorization(authCondition)(EditProfilePage)
