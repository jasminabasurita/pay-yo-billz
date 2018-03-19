import React, { Component } from "react"
import axios from "axios"
import { connect } from "react-redux"
import Dropzone from "react-dropzone"
import ReactCrop from "react-image-crop"
import "react-image-crop/lib/ReactCrop.scss"

class UserPhotoUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      photo: {},
      error: "",
      crop: { aspect: 1 }
    }
  }

  handleDrop = (accepted, rejected) => {
    if (rejected.length) {
      this.setState({ error: "Error Uploading Photo" })
    } else {
      console.log(accepted)
      this.setState({
        photo: accepted[0],
        error: ""
      })
    }
  }

  handleCropChange = crop => {
    this.setState({ crop })
  }

  onImageLoaded = image => {
    const [smallest, largest] =
      image.width > image.height ? ["height", "width"] : ["width", "height"]
    this.setState({
      crop: {
        x: 0,
        y: 0,
        [smallest]: 100,
        [largest]: image[smallest] / image[largest] * 100,
        aspect: 1
      }
    })
  }

  handleCropComplete = (crop, pixelCrop) => {
    console.log(pixelCrop)
  }

  handleSubmit = photo => {
    const config = {
        headers: { "content-type": "multipart/form-data" }
      },
      data = new FormData()
    data.append("photo", photo)

    axios.post("/api/photo", data, config)
  }

  render() {
    const { photo, error } = this.state
    return (
      <div id="photo">
        <div id="photo-hero">
          {!photo.preview && (
            <Dropzone
              id="photo-upload"
              accept="image/*"
              multiple={false}
              onDrop={this.handleDrop}
            >
              <h4>Drop a photo or click to browse filesystem</h4>
              <i className="fas fa-upload fa-4x" />
            </Dropzone>
          )}
          {!!photo.preview && (
            <div id="photo-crop">
              <ReactCrop
                src={photo.preview}
                crop={this.state.crop}
                onChange={this.handleCropChange}
                onComplete={this.handleCropComplete}
                onImageLoaded={this.onImageLoaded}
              />
              <button onClick={() => this.handleSubmit(photo)}>Submit</button>
            </div>
          )}
          {!!error && <div>{error}</div>}
        </div>
      </div>
    )
  }
}

const mapState = () => ({}),
  mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(UserPhotoUpload)