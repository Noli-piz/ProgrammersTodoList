import React, { useState, useEffect, useReducer, useContext } from "react";
import Task from "./Task";
import { useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";
import "../App.css";
import axios from 'axios'
import AddTaskModal from './AddTaskModal';
import { ApiContext, AlertContext } from "../context/Context";

function DragDrop() {
  let navigate = useNavigate();
  const { apiBaseUrl } = useContext(ApiContext);
  const { setAlert } = useContext(AlertContext);

  const [ refresh , forceRefresh] = useReducer(x=>x+1, 0);
  const [ showAddModal , setShowAddModal] = useState(false);
  const [ selectedStatus , setSelectedStatus] = useState();
  const [ onTask , setOnTask ] = useState([]);
  const [ onGoingTask , setOnGoingTask] = useState([]);
  const [ onDoneTask , setOnDoneTask] = useState([]);

  // Retrieve Data
  useEffect(()=>{
    axios.get( apiBaseUrl + '/todos/', 
    { 
      params: { 'username' : localStorage.getItem('username') },
      headers: { 'accessToken' : localStorage.getItem('accessToken') }
    } ).then(function (response) {

      if(response.data.error){
        return alert(response.data.error);
      }

      const taskList = response.data.filter((a) => a.status === "task");
      setOnTask(taskList);

      const ongoingTaskList = response.data.filter((a) => a.status === "ongoing");
      setOnGoingTask(ongoingTaskList);

      const doneTaskList = response.data.filter((a) => a.status === "done");
      setOnDoneTask(doneTaskList);
    })

  }, [refresh])
  

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => updateTask(item.id, 'task'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));


  const [{ isOver2 }, dropToOnGoing] = useDrop(() => ({
    accept: "task",
    drop: (item) => updateTask(item.id, 'ongoing'),
    collect: (monitor) => ({
      isOver2: !!monitor.isOver(),
    }),
  }));

  const [{ isOver3 }, dropToDone] = useDrop(() => ({
    accept: "task",
    drop: (item) => updateTask(item.id, 'done'),
    collect: (monitor) => ({
      isOver3: !!monitor.isOver(),
    }),
  }));

  // Update Task
  const updateTask = (id, taskStatus) => {
    axios.post( apiBaseUrl + '/todos/update', 
      { 'id': id, 'status' : taskStatus },
      { 'headers' : { 'accessToken' : localStorage.getItem("accessToken") }}
    ).then(function (response) {
      if(response.data.error)
        return alert(response.data.error);

      forceRefresh();
    })
  };

  // Delete Task
  const deleteTask = (id) => {
    axios.post( apiBaseUrl + '/todos/delete', 
      { 'id': id },
      { 'headers' : { 'accessToken' : localStorage.getItem("accessToken") }}
    ).then(function (response) {
      if(response.data.error)
        return setAlert({"action" : "error", "message": response.data.error});

      setAlert({"action" : "success", "message": "Todo has been deleted successfully."}); // Show and Set Alert Message
      forceRefresh();
    })
  };
  
  // Show Add Modal
  const showModal = (taskStatus)=>{
    setShowAddModal(true);
    setSelectedStatus(taskStatus);
  }
  
  // Logout the user
  const onSignOut = () => {
    if(!window.confirm("Are you sure you want to sign out?")) return;
    localStorage.removeItem('accessToken');
    navigate("/signin");
  };
  
  
  return (
    <>
    <div>
      <div className="card" style={{top:"0",width:"fit-content" , margin:"-20px 0px 30px 0px", padding:"20px 20px 0px 20px"}}>
       <div style={{fontSize:"29px"}}> Hello, { localStorage.getItem('username') } </div>
       <div> <button className="btn-signout" onClick={()=> onSignOut() }> Sign Out </button> </div>
      </div>
      <div className="task-container">
        <div className="task" > 
          <div className="heading-board">
            <div className="task-title"> TODO </div>
            <button type="button" className="btnAddTask" onClick={()=> showModal("task")}> + </button>
          </div>

          <div className="board" ref={drop} style={isOver?{backgroundColor:"honeydew"} : {}}>
            {onTask.map((data) => {
                return <Task id={data._id} key={data._id} title={data.title} description={data.description} category={data.category} deleteTask={deleteTask} />;
            })}
          </div>
        </div>

        <div className="ongoing-task">
          <div className="heading-board">
            <div className="task-title"> ON GOING </div>
            <button type="button" className="btnAddTask" onClick={()=> showModal("ongoing")}> + </button>
          </div>

          <div className="board" ref={dropToOnGoing} style={isOver2?{backgroundColor:"honeydew"} : {}}>
            {onGoingTask.map((data) => {
              return <Task id={data._id} key={data._id} title={data.title} description={data.description} category={data.category} deleteTask={deleteTask} />;
            })}
          </div>
        </div>


        <div className="done-task">
          <div className="heading-board">
            <div className="task-title"> DONE </div>
            <button type="button" className="btnAddTask" onClick={()=> showModal("done")}> + </button>
          </div>

          <div className="board" ref={dropToDone} style={isOver3?{backgroundColor:"honeydew"} : {}}>
            {onDoneTask.map((data) => {
              return <Task id={data._id} key={data._id} title={data.title} description={data.description}  category={data.category} deleteTask={deleteTask}  />;
            })}
          </div>
        </div>
      </div>

      {showAddModal && <AddTaskModal setShowAddModal={setShowAddModal} forceRefresh={forceRefresh} taskStatus={selectedStatus} />}
    </div>
    </>
  );
}

export default DragDrop;