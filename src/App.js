import './App.css';
import Mentor from "./components/Mentor"
import { Route, Routes } from 'react-router-dom';
import UserProvider from './components/UserProvider';
import NavBar from './components/NavBar';
import AddMoreStudent from "./components/AddMoreStudent"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./components/HomePage"

function App() {
  return (
    <UserProvider>
      <ToastContainer />
      <div>
        <Routes>
          <Route exact path = "/" element = {<HomePage/>}/>    
          <Route path = "/mentor1" element = {<Mentor id = {1}/>}/>    
          <Route path = "/mentor2" element = {<Mentor id = {2}/>}/>    
          <Route path = "/addstudent" element = {<AddMoreStudent/>}/>    
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
