import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  })
  const handleSubmit = async(e) => {
    e.preventDefault()
      try {
        const user = await fetch('http://localhost:3000/api/v1/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        })

        if(user) {
            console.log("User Created")
        }else{
            console.error("Error")
        }
      } catch (error) {
        console.log(error)
      }
      
     
      navigate('../dashboard')
      setFormData({
        username: "",
        lastname: "",
        firstname: "",
        password: ""
      })
  }

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <div className='signup-container'>
        <h1>Sign Up</h1>
        <p>Enter your information to create an</p>
        <span>account</span>
        <form onSubmit={handleSubmit}>
            <div>
                <p>First Name</p>
                <input type="text"
                       name='firstname'
                       value={formData.firstname}
                       onChange={handleChange} 
                       placeholder='Amit'
                       required
                />
            </div>
            <div>
            <p>Last Name</p>
                <input type="text"
                       name='lastname'
                       value={formData.lastname}
                       onChange={handleChange} 
                       placeholder='Kumar'
                       required
                />
            </div>
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
        <p>Already have an account?<Link to='../signin'><span>Login</span></Link></p>
    </div>
  )
}

export default Signup