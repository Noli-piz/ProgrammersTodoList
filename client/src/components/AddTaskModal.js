import React, {useState, useContext} from 'react'
import axios from 'axios'
import {AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ApiContext, AlertContext} from "../context/Context";

function AddTaskModal( {setShowAddModal, forceRefresh, taskStatus}) {
  const { apiBaseUrl } = useContext(ApiContext);
  const { setAlert } = useContext(AlertContext);

  const [ title, setTitle ] = useState(' ');
  const [ description, setDescription ] = useState(' ');
  const [ category, setCategory ] = useState(' ');
  const [ showLoading, setShowLoading ] = useState(false);


  const add =()=>{

    // Start checking if input is valid
    let error_count =0;
    if(title.trim() === '') {
      setTitle('');
      error_count =1;
    }
    if(description.trim() === '') {
      setDescription('');
      error_count = 1;
    }
    if(category.trim() === '') {
      setCategory('');
      error_count = 1;
    }

    if(error_count === 1) return;
    // End Checking input

    // Proceeds to the database
    setShowLoading(true);
    axios.post( apiBaseUrl +'/todos', 
      { 'username' : localStorage.getItem('username'), 'title': title, 'description' : description, 'category' : category, 'status' : taskStatus },
      { 'headers' : { 'accessToken' : localStorage.getItem("accessToken") }}
    ).then(function (response) {

      if(response.data.error){
        setShowLoading(false);
        return setAlert({"action" : "error", "message": response.data.error});
      }

      setTimeout(function(){
        setShowLoading(false);
        setAlert({"action" : "success", "message": "Todo has been added successfully."}); // Show and Set Alert Message
        forceRefresh();
        setShowAddModal(false);
      }, 1000);
    })
  }

  return (
    <div className="modal"  >
        <div className="modal-content">
          <div className="modal-text"  > Add Todo </div>
          <input type="text" className="modal-title" placeholder="Enter Title" onChange={(e)=> { setTitle(e.target.value) } } />
          { !title && <div className="error"> Title is required! </div>}

          <textarea type="text" row="9" className="modal-description" placeholder="Enter Description" onChange={(e)=> { setDescription(e.target.value) } }  />
          { !description && <div className="error"> Description is required! </div>}

          <select id="category" onChange={(e)=> setCategory(e.target.value)}>
            <option value="" disabled selected> Select Category </option>
            <option value="feature"> Feature or Add Code </option>
            <option value="bug"> Bugs or Errors </option>
            <option value="changes"> Revise or Change Code </option>
            <option value="others"> Others </option>
          </select>
          { !category && <div className="error"> Category is required! </div>}
          
          <div className="modal-btn-ctr">
            <button className="btnCancel" type="submit" onClick={()=> {setShowAddModal(false)}} > CANCEL </button>
            <button className="btnSubmit" type="submit" onClick={()=> add() } > 
            { !showLoading ? 'SUBMIT' : <AiOutlineLoading3Quarters className="loading"/>} 
            </button>
          </div>
        </div>
    </div>
  )
}

export default AddTaskModal