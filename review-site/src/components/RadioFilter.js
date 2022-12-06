import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFilter, selectFiltering, setFiltering } from '../slices/filterSlice'

const RadioFilter = (props) => {
  const dispatch = useDispatch()
  const isFiltering = useSelector(selectFiltering)

  const handleFilter = rForm => {
    if (rForm.checked) {
      console.log('checked')
      dispatch(addFilter({title: `authenticated-${rForm.id}`}))
      dispatch(setFiltering())
    }
  }

  useEffect(() => {
    const radioForms = [].slice.call(document.getElementsByClassName('radio-form'))
    radioForms.map(rForm => rForm.addEventListener('change', () => handleFilter(rForm)))

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, [])

  useEffect(() => {
    const radioForms = [].slice.call(document.getElementsByClassName('radio-form'))

    if (!isFiltering) {
      radioForms.map(rForm => rForm.checked = false)
    }

  }, [isFiltering])

  return (
    <form action="/" className='font-light text-sm text-slate-500'>
    <div className='flex items-center mb-3'>
      <input 
      type="radio" 
      id={props.details.ids[0]} 
      name={props.details.name} 
      value={props.details.values[0]}
      className='radio-form appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer hover:opacity-100' 
      />
      <label htmlFor={props.details.ids[0]} className='pl-3 hover:cursor-pointer hover:opacity-100'>{props.details.radioValues[0]}</label>
    </div>
    <div className='flex items-center'>
      <input 
      type="radio" 
      id={props.details.ids[1]} 
      name={props.details.name} 
      value={props.details.values[1]}
      className='radio-form appearance-none h-5 w-5 focus:opacity-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer hover:opacity-100' 
      />
      <label htmlFor={props.details.ids[1]} className='pl-3 hover:cursor-pointer hover:opacity-100'>{props.details.radioValues[1]}</label>
    </div>
  </form>
  )
}

export default RadioFilter