import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);



function App() {
  const [newUser, setNewUser]  = useState(false);
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
 
   if(newUser){
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=> {
        
        const newError = {...user}
        newError['error'] = '';
        newError.success = true;
        setUser(newError)
        updateUserName(user.name);
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
   }
   if(!newUser){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then (res => {
      const newError = {...user}
      newError['error'] = '';
      newError.success = true;
      setUser(newError)
      console.log("sign in info", res)
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
 const updateUserName = name =>{
  var user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name,
      }).then(function() {
        
        console.log('name update successfully')
      }).catch(function(error) {
        // An error happened.
      });
 }
 const provider = new firebase.auth.FacebookAuthProvider();
 const facebookClik =() => {
            firebase.auth().signInWithPopup(provider).then(res=> {
              const users = res.user;
              console.log("facebook login", users)
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log("already login", error)
              // ...
            });
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
      }<br/>
      <button onClick={facebookClik}>SignUp using Facebook</button>

      <h1>Our own Authentication</h1>
     <br/>
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Singup</label>
    <form action="" onSubmit={handleSubmit}>
      {
        newUser && <input type="text" name='name' onBlur={changeValue} placeholder='Enter your name'/>
      }
      <br/>
        <input type="email" name="email" onBlur={changeValue} placeholder="Enter your email" id="" required/>
           <br/>
        <input type="password" name="password" onBlur={changeValue} placeholder="Enter your password" id="" required/>
           <br/>
        <input type="submit" value={newUser?"signUp": "signIN"}/>
    </form>
    <p style={{color:"red"}}>{user.error}</p>
    {
      user.success && <p style={{color:"green"}}>User {newUser? "Create": "Logged"} Sussecfully</p> 
    }
    </div>
  );
}

export default App;
