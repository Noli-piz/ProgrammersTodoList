import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import {BsFillBugFill, BsFillTrash3Fill, BsFillStarFill } from 'react-icons/bs';
import {TbArrowsRandom } from 'react-icons/tb';
import {HiSquares2X2 } from 'react-icons/hi2';

function Task({ id, title, description, category, deleteTask }) {
  
  const [showConfirm , setShowConfirm] = useState(false);

  //
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id : id },
    collect: (monitor) => ({
      isDragging : !!monitor.isDragging(),
    }),
  }));

  // Disable Confirm Button after 5 seconds
  const show = ()=>{
    setShowConfirm(true);
    setTimeout(()=>{
      setShowConfirm(false);
    }, 5000);
  };

  return (
    <div  className="card dnd" ref={drag} style={ isDragging ? {opacity:".3"} : {} } >
      <div>
        <div style={{float:"right"}}>
          {showConfirm ? 
            <div className="btnConfirmDelete" onClick={()=>deleteTask(id)} > confirm </div> :
            <BsFillTrash3Fill className="btnDelete" type="button" onClick={()=>show()}  />
          }
        </div>
        <div style={{display:"flex", padding:"20px 0px 0px 0px"}}>
          <div className="icon-container">
            { category === "feature" && <BsFillStarFill color="yellow" size="25px" title="feature"/> }
            { category === "bug" && <BsFillBugFill color="red" size="25px" title="bug"/> }
            { category === "changes" && <TbArrowsRandom color="orange" size="20px" title="change code"/> }
            { category === "others" && <HiSquares2X2 color="blue" size="20px" title="change code"/> }
          </div>
          <div>
            <div className="title" > { title } </div>
            <div className="description" > { description } </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;