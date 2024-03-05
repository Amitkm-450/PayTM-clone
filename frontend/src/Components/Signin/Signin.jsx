import { useState } from 'react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const handleSubmit = async(e) => {
    e.preventDefault()
      try {
        const user = await fetch('http://localhost:3000/api/v1/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        })

        if(user) {
            console.log("User Logged In")
        }else{
            console.error("Error")
        }
      } catch (error) {
        console.log(error)
      }

      
      navigate('../dashboard')
  }

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className='signin-container'>
        <h1>Sign In</h1>
        <p>Enter your credentials to access your</p>
        <span>account</span>
        <form onSubmit={handleSubmit}>
           <div>
            <p>Email</p>
                <input type="text"
                       name='username'
                       value={formData.username}
                       onChange={handleChange} 
                       placeholder='amitkm@gmail.com'
                       required
                />
            </div>
            <div>
               <p>Password</p>
                <input type="password"
                       name='password'
                       value={formData.password}
                       onChange={handleChange} 
                       required
                />
            </div>
            <button type='submit' className='submit-btn'>Sign Up</button>
        </form>
        <p>Don't have an account?<Link to='../signup'><span>Sign Up</span></Link></p>
    </div>
  )
}

export default Signin