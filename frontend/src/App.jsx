import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup'
import Dashboard from './Components/Dashboard/Dashboard'
import Sendmoney from './Components/Sendmoney/Sendmoney'



function App() {

  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path='/signin' element={<Signin />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/send' element={<Sendmoney />}/>
          </Routes>
        </div>
    </BrowserRouter>
    
  )
}

export default App
