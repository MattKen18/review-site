import { config, useSprings, animated, useSpring } from "@react-spring/web";
import { useDrag, useGesture } from "@use-gesture/react";
import { clamp } from 'lodash';
import swap from 'lodash-move';
import React, { useEffect, useRef, useState } from "react"; 
import { maxAddOns } from "../parameters";

function DraggableList({ items }) {
  const [dimensions, setDimensions] = useState({x: null, y: null}) //dimensions of each item in items
  
  useEffect(() => {
    console.log('items: ', items)
  }, [items])
  
  const fn = (order, active = false, originalIndex = 0, curIndex = 0, x = 0) => (index) => {
    return active && index === originalIndex
    ? {
      x: curIndex * 192 + x,
      scale: 1.1,
      zIndex: 1,
      boxShadow: '0px 15px 50px -15px rgba(0,0,0,0.3)',
      immediate: (key) => key === 'zIndex',
      config: (key) => (key === 'x' ? config.stiff : config.default),
    }
    : {
      x: order.indexOf(index) * 192,
      scale: 1,
      zIndex: 0,
      boxShadow: '0px 1px 15px -5px rgba(0,0,0,0.1)',
      immediate: false,
    };
  };
  
  const order = useRef(items.map((_, index) => index));
  const [springs, api] = useSprings(items.length, fn(order.current));

  const bind = useDrag(({ args: [originalIndex], active, movement: [mx, ] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(Math.round((curIndex * 192 + mx) / 192), 0, items.length - 1);
    const newOrder = swap(order.current, curIndex, curRow);
    api.start(fn(newOrder, active, originalIndex, curIndex, mx));
    if (!active) order.current = newOrder;
  });



  return (
    <div style={{width: maxAddOns.images * 192, height: 192}} className='flex flex-row items-start justify-center space-x-2 overflow-hidden' >
     {springs.map(({ x, scale, zIndex, boxShadow }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          className={`relative w-[192px] h-48 rounded-lg overflow-hidden bg-slate-800 hover:cursor-grab active:cursor-grabbing`}
          style={{
            backgroundImage: `url(${items[i]})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            // transform: y.to(x => `translate3d(${x}px,0,0) scale(${scale})`),
            boxShadow: boxShadow,
            zIndex,
            // scale,
            x,
            // position: 'absolute',
            // width: '100%',
            // height: '100%',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export default DraggableList