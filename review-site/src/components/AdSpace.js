import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const AdSpace = ({pos='left'}) => {
  const location = useLocation();

  useEffect(() => {
    const resizeSidePane = () => {
      const headerHeight = window.getComputedStyle(document.getElementById('header')).getPropertyValue('height')
      const sidePane = document.getElementById('side-pane-'+pos)
  
      const newSidePaneHeight = window.innerHeight - headerHeight.slice(0, headerHeight.length-2)
      if (JSON.stringify(location).includes('forum')) {
        sidePane.style.height = newSidePaneHeight+'px'
      } else {
        sidePane.style.height = '100%'
      }
    }

    resizeSidePane()
    window.addEventListener('resize', resizeSidePane)

    return () => window.removeEventListener('resize', resizeSidePane)
  

  }, [location])

  return (
    <div id={'side-pane-'+pos} className='h-full bg-gray-50'>
      <h1 className='text-center'>AdSpace</h1>
    </div>
  )
}

export default AdSpace