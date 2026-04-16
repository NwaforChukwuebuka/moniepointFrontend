import React, { memo, useState } from 'react'

const Login = () => {
const userDetails = {
    username: "",
    password: ""
}

const [userProfile, setUserProfile] = useState(userDetails);

function handleChange(e) {
    const { name, value } = e.target;
    setUserProfile((prev)=>({...prev,[name]: value}))
}
console.log(userProfile)

  return (
    <div>
        <form action="">
    <div>
        <label htmlFor="username">Username</label>
        <input name="username" onChange={handleChange} type="text" id='username' placeholder='Enter your username' />
    </div>
    <div>
        <label htmlFor="password">Password</label>
        <input name="password" onChange={handleChange} type="password" id='password' placeholder='Enter your password' />
    </div>
    <button>Login</button>
    </form>
    </div>
  )
}

export default memo(Login)
