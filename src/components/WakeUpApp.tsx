import { useEffect } from 'react'

function WakeUpApp() {
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`, {
  credentials: "include",
  method:'GET'
});
    },[])
  return (
     <>
        {/* This component wakes up the render API */}
     </>
  )
}

export default WakeUpApp