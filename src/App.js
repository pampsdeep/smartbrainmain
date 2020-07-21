import React, { Component } from 'react';
import Particles from 'react-particles-js';
//import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/register'
import './App.css';


const particalOptions={
  particles:{
    number:{
      value:100,
      density:{
        enable:true,
        value_area:800
      }
    }
  }                
}

const initialState={
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn:false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined :new Date()
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = initialState;    
    }
    
  onRouteChange = (route) => {  
     if (route==='signout')
     {
       this.setState(initialState);
     } else if (route==='home'){
       this.setState({ isSignedIn: true });
     }
     this.setState({ route: route });
  }
  loadUser=(usr)=>{
    this.setState({user : {
        id:usr.id,
        name:usr.name,
        email:usr.email,
        entries:usr.entries,
        joined :usr.joined
    }});
  }

  
  calculateFaceLocation = (data) => {
    const clariaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const wdth = Number(image.width);
    const hgt = Number(image.height);
    //console.log(wdth, hgt);
    return {
      leftCol: clariaiFace.left_col * wdth,
      topRow: clariaiFace.top_row * hgt,
      rightCol: wdth - clariaiFace.right_col * wdth,
      bottomRow: hgt - clariaiFace.bottom_row * hgt,
    };
  };
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://secret-everglades-99345.herokuapp.com/imageUrl',{
      method:'post',
      headers:{
               'Accept': 'application/json',
               'Content-Type': 'application/json'
              },
      body:JSON.stringify({
        input:this.state.input
      })  
    }).then(response=>response.json())
    .then(response =>{
        if(response){
          fetch('https://secret-everglades-99345.herokuapp.com/image',{
             method:'put',
             headers:{
               'Accept': 'application/json',
               'Content-Type': 'application/json'
              },
              body:JSON.stringify({
                id:this.state.user.id
              })
            }).then(response=>response.json())
            .then(count=>{
              this.setState(Object.assign(this.state.user,{entries:count}))
            }).catch((err) => console.log(err))
          }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch((err) => console.log(err));
    };

  render() {
      const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particalOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'  
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
          :(
            this.state.route==='signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )          
        }
      </div>
    );
  }
}

export default App;
