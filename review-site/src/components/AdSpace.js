import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { selectAlerting, selectAlertBody, selectAlertType} from '../slices/alertSlice';
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion';

import Alert from './Alert';

const AdSpace = ({pos='left'}) => {
  const location = useLocation();

  const dispatch = useDispatch()
  const alerting = useSelector(selectAlerting)
  const alertBody = useSelector(selectAlertBody)
  const alertType = useSelector(selectAlertType)

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


  useEffect(() => {
    console.log(alerting, alertBody, alertType)
  }, [alerting, alertBody, alertType])

  return (
    <div id={'side-pane-'+pos} className='relative h-full bg-gray-50 overflow-hidden'>
      {
        alerting &&
        <motion.div className='absolute right-3 bottom-12 w-11/12 h-12'
        initial={{ x: 100, opacity:0 }}
        animate={{ x: 0, opacity:100 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}>
          <Alert content={{body: alertBody, type: alertType}} />
        </motion.div>
      }
      <h1 className='text-center'>AdSpace</h1>
    </div>
  )
}

export default AdSpace