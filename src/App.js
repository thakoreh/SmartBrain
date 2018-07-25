import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '486bb947764d48b8b2d4988d2e7c97f6'
});

const particlesOptions = {
    particles: {
      number: {
        value :  30,
        density : {
          enable : true,
          value_area : 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input : '',
      imageURL : '',
      box:{},

    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL:this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
      <Particles className="particles"
            params={particlesOptions}
          />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          />
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
