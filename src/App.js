import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);



function App() {

  const [user, setUser] = useState({
    isLogin: false,
    name: '',
    password: '',
    email: '',
    photo: '',
    error: '',
    success: false
  })

 const singIn=()=>{
    const  googleApi = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleApi).then(res=> {
      const users = res.user;

      const signIn ={
        isLogin: true,
        name: users.displayName,
        email: users.email,
        photo: users.photoURL
      }
      setUser(signIn)
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
 }


 const singOut =()=>{
  firebase.auth().signOut().then(function() {
    const signIn ={
      isLogin:false,
      name: '',
      email: '',
      photo: ''
    }
    setUser(signIn)
    console.log("sign Out")
  }).catch(function(error) {
    // An error happened.
  });
 }

 const changeValue =(e)=>{
   let isFormValid= true;
    if(e.target.name === "email"){
     isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }
    if(e.target.name === 'password'){
      const isPasswordValid =e.target.value.length >6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value)
      isFormValid = isPasswordValid && passwordHasNumber;
    }

    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo) ;
    }

 }
 const handleSubmit = (e)=>{
 
   if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=> {
        
        const newError = {...user}
        newError['error'] = '';
        newError.success = true;
        setUser(newError)
      })
      .catch(function(error) {
      // Handle Errors here.
     
      var errorMessage = error.message;
      const newError = {...user}
      newError['error'] = errorMessage;
      setUser(newError)
      // ...
    });
   }
   e.preventDefault();
 }
 
  return (
    <div className="App">
      {
       user.isLogin && 
            <div>
              <h1>Name: {user.name}</h1>
              <p>Email: {user.email}</p>
              <img src={user.photo} alt=""/>
            </div>
      }
      {
        user.isLogin? <input onClick={singOut} type="submit" value="SignOut"/>: <input onClick={singIn} type="submit" value="SignIn"/>
      }


     

    <form action="" onSubmit={handleSubmit}>
      <input type="text" name='name' onBlur={changeValue} placeholder='Enter your name'/>
      <br/>
        <input type="email" name="email" onBlur={changeValue} placeholder="Enter your email" id="" required/>
           <br/>
        <input type="password" name="password" onBlur={changeValue} placeholder="Enter your password" id="" required/>
           <br/>
        <input type="submit" value="Submit Now"/>
    </form>
    <p style={{color:"red"}}>{user.error}</p>
    {
      user.success && <p style={{color:"green"}}>User Create Sussecfully</p> 
    }
    </div>
  );
}

export default App;
