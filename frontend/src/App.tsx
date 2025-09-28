import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import LoginPage from './pages/Login'
import SignUpPage from './pages/Signup'
import ListPage from './pages/List'
import BoardPage from './pages/Board'
function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/' element={<ListPage/>}/>
        <Route path='/board' element={<BoardPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App
