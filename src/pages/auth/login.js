import React, {useEffect, useState} from 'react';
import { redirect, useNavigate } from "react-router-dom";
import { Grid,Paper, Avatar, TextField, Button } from '@material-ui/core';
import { Api } from "../../utils/Api";
const Login = () => {
  const location = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectTo, setRedirectTo] = useState(false);
  
  useEffect(()=> {
    if(localStorage.getItem('user_id'))
      setRedirectTo(true)
  })
  const login = async () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length === 0 || password.length < 8)
      alert("email & password is required. Password minimum length is 8 characters.");
    else {
      if (re.test(email)) {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        const response = await Api("post", `auth/login`, formData);
        if (response.status === 200) {
          localStorage.setItem("user_id", response.data.data._id);
          localStorage.setItem("name", response.data.data.name);
          localStorage.setItem("admin", JSON.parse(response.data.data.admin));
          setRedirectTo(true);
        } else
          alert(response.data.msg);
      } else
        alert("Enter a valid email");
    }
  };
  
  const paperStyle={padding :20,width:280, margin:"100px auto"}
  const avatarStyle={backgroundColor:'#1bbd7e'}
  const btnstyle={margin:'8px 0'}
  
  return(
    (redirectTo && location('/home')),
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}></Avatar>
          <h2>Sign In</h2>
        </Grid>
        <TextField label='Email' placeholder='Enter email' variant="outlined" type={"email"} onChange={(e)=>setEmail(e.target.value)} margin={"normal"} fullWidth required />
        <TextField label='Password' placeholder='Enter password' type='password' variant="outlined" onChange={(e)=>setPassword(e.target.value)} margin={"normal"} fullWidth required />
        <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => login()}>Sign in</Button>
      </Paper>
    </Grid>
  )
}

export default Login