import React from 'react'

const TimePassed = ({timestamp}) => {

  const timePassed = () => {
    const timeCreated = timestamp.toDate()
    const currentTime = new Date()
    const timePassed = (currentTime.getTime()-timeCreated.getTime())/1000 //milliseconds passed from when the review was created to now

    const year = 31557600
    const month = 2629800
    const week = 604800
    const day = 86400
    const hour = 3600
    const minute = 60

    if (timePassed >= year) {
      const years = Math.floor(timePassed/year)
      return years > 1 ? `${years} years ago` : `${years} year ago`
    } else if (timePassed >= month) {
      const months = Math.floor(timePassed/month)
      return months > 1 ? `${months} months ago` : `${months} month ago`
    } else if (timePassed >= week) {
      const weeks = Math.floor(timePassed/week)
      return weeks > 1 ? `${weeks} weeks ago` : `${weeks} week ago`
    } else if (timePassed >= day) {
      const days = Math.floor(timePassed/day)
      return days > 1 ? `${days} days ago` : `${days} day ago`
    } else if (timePassed >= hour) {
      const hours = Math.floor(timePassed/hour)
      return hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
    } else if (timePassed >= minute) {
      const minutes = Math.floor(timePassed/minute)
      return minutes > 1 ? `${minutes} mins ago` : `${minutes} min ago`
    } else {
      const seconds = Math.floor(timePassed)
      return seconds > 1 ? `${seconds} seconds ago` : seconds <= 0 ?  `1 second ago` : `${seconds} second ago`
      // return Math.floor(timePassed) + ' seconds ago'//"< 1min ago"
    }
  }

  return (
    <div>{timePassed()}</div>
  )
}

export default TimePassed