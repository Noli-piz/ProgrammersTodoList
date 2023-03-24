import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import { ApiContext, AlertContext } from './context/Context'
import React, {useState} from 'react';
import AlertModal from './components/AlertModal'

function App() {

  
  let apiBaseUrl = "http://localhost:3003";
  const [alert, setAlert] = useState({"action" : '' , 'message' : ''});

  return (
    <div className="App">
      <ApiContext.Provider value={{apiBaseUrl}} >
      <AlertContext.Provider value={{ alert, setAlert}} >
      <DndProvider backend={HTML5Backend} >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn/>} /> 
            <Route path="/home" element={<Home/>} /> 
            <Route path="/signin" element={<SignIn/>} /> 
            <Route path="/signup" element={<SignUp/>} /> 
            <Route path="*" element={<ErrorPage/>} /> 
          </Routes>
        </BrowserRouter>

        {/*  */}
        <AlertModal/>

      </DndProvider>
      </AlertContext.Provider>
      </ApiContext.Provider>
    </div>
  );
}

export default App;
