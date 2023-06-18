import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFilter, removeFilter, selectAuthFiltering, selectFiltering, setFiltering } from '../slices/filterSlice'

const RadioFilter = (props) => {
  const [radioClicked, setRadioClicked] = useState(null)
  const dispatch = useDispatch()
  const authFiltering = useSelector(selectAuthFiltering)

  const handleFilter = (e) => {
    e.preventDefault()
    const form = e.target

    const authRadio = form.querySelector('input[type="radio"]:checked') //radio button selected (verified/unverified)

    if (!authFiltering) { //first time applying auth filter
      dispatch(addFilter({title: `authenticated-${authRadio.value}`}))
    } else if (authFiltering && radioClicked !== authRadio) { //if clicked the inactive auth filter radio
      dispatch(addFilter({title: `authenticated-${authRadio.value}`}))
    }else if (authFiltering && radioClicked === authRadio) { // clicked the active auth filter
      dispatch(removeFilter({title: `authenticated-${authRadio.value}`})) 
    }

    setRadioClicked(authRadio)

  }

  const submitForm = () => {
    document.getElementById('auth-filter-submit-btn').click()
  }

  useEffect(() => {
    if (!authFiltering) {
      const radioFilters = [].slice.call(document.getElementsByClassName('radio-form'))
      radioFilters.map(radio => radio.checked = false)
    }

  }, [authFiltering])



  return (
    <form id='authenticated-filter-form' action="/" onSubmit={e => handleFilter(e)} className='font-normal text-sm text-slate-500'>
      <div className='flex items-center mb-3'>
        <input 
        type="radio" 
        id={props.details.ids[0]} 
        name={props.details.name} 
        value={props.details.values[0]}
        onClick={submitForm}
        className='radio-form appearance-none h-5 w-5 focus:opacity-100 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer hover:opacity-100' 
        />
        <label htmlFor={props.details.ids[0]} className='pl-3 hover:cursor-pointer hover:opacity-100'>{props.details.radioValues[0]}</label>
      </div>
      <div className='flex items-center'>
        <input 
        type="radio" 
        id={props.details.ids[1]} 
        name={props.details.name} 
        value={props.details.values[1]}
        onClick={submitForm}
        className='radio-form appearance-none h-5 w-5 focus:opacity-100 focus:outline-none border checked:border-none checked:bg-blue-600 rounded-md hover:cursor-pointer hover:opacity-100' 
        />
        <label htmlFor={props.details.ids[1]} className='pl-3 hover:cursor-pointer hover:opacity-100'>{props.details.radioValues[1]}</label>
      </div>
      <button type='submit' id='auth-filter-submit-btn' className='hidden'></button>

  </form>
  )
}

export default RadioFilter