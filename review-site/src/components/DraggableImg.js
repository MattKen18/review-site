import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import React from 'react'

const DraggableImg = ({imgSrc, index}) => {

  const [{x, y}, api] = useSpring(() => ({ x: 0, y: 0}))

  // const bind = useDrag(({ down, movement: [mx, my] }) => api.start({ x: mx, y: my, immediate: down }), { axis: 'x' })

  // const dragBind = useDrag(({ args:[], down, offset: [ox, oy] }) => (
  //   api.start({ x: ox, y: oy, immediate: down }),
  //   {axis: 'x'}
  // ))

  const bind = useDrag(({ down, movement: [mx, my] }) => (
    api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down }), 
    {preventDefault: true}
  ))

  return (
    <animated.div {...bind()} style={{ x, y, backgroundImage: `url(${imgSrc})`, backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat'}} className={`relative z-[100] w-48 h-48 rounded-lg overflow-hidden bg-slate-800 hover:cursor-grab active:cursor-grabbing`}>
      {/* <img 
        // data-index={index}
        src={imgSrc}
        alt={'uploaded image '+(index+1)}
        className={`relative z-[0] w-full h-full object-contain bg-slate-700`}
      />   */}
    </animated.div>
  )
}

export default DraggableImg