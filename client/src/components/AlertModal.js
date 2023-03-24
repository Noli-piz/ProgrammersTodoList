import React, { useState, useContext, useEffect } from 'react'
import { AlertContext } from '../context/Context'
import { BiCheckCircle, BiErrorCircle, BiInfoCircle} from 'react-icons/bi'
import { IoMdClose} from 'react-icons/io'
import { TiWarningOutline} from 'react-icons/ti'

function AlertModal() {

    const { alert } = useContext(AlertContext);
    const [displayAlert, setDisplayAlert] = useState(false);


    // Show message when alert (variable) is changed/ triggered
    useEffect(()=>{
        setDisplayAlert(true);

        // After 5 seconds the alert (modal) will disabled
        let TIMEOUT_TIME = 5000;
        setTimeout(() => {
            setDisplayAlert(false);
        }, TIMEOUT_TIME)
    },[alert])


return (
    <>
        { displayAlert &&  
            <div className={"alert-container "+ alert.action} >
                <div style={{display:"flex", alignItems:"center", gap:"10px"}}> 
                    { alert.action === "info" && <BiInfoCircle/> }
                    { alert.action === "success" && <BiCheckCircle/> }
                    { alert.action === "error" && <BiErrorCircle/> }
                    { alert.action === "warning" && <TiWarningOutline/> }

                    { alert.message} 
                    <IoMdClose style={{cursor:"pointer"}} onClick={()=>{setDisplayAlert(false)}} /> 
                </div>
            </div>
        }
    </>
  )
}

export default AlertModal