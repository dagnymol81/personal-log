import add from 'date-fns/add'

export const useDates = () => {

  const getTimeDue = (due, units) => {

    let timeDue = null
    
    if (due >= 1) {
      switch (units) {
        case 'minutes':
          timeDue = add(new Date(), {
            minutes: Number(due)
          })
          break;
        case 'hours':
          timeDue = add(new Date(), {
            hours: Number(due)
          })
        break;
        case 'days':
          timeDue = add(new Date(), {
            days: Number(due)
          })
          break;
        case 'weeks':
          timeDue = add(new Date(), {
            weeks: Number(due)
          })
          break;
        case 'months':
          timeDue = add(new Date(), {
            months: Number(due)
          })
          break;
        default:
          timeDue = null
      }
    }
    return timeDue
  }

  const getInterval = (due, units) => {
    let interval = null;
    switch (units) {
      case 'minutes':
        interval = due;
        break;
      case 'hours':
        interval = due * 60;
      break;
      case 'days':
        interval = due * 1440;
        break;
      case 'weeks':
        interval = due * 10080
        break;
      default:
        interval = null
    }
    return interval
  }

  const getDate = (date, time) => {
    if (!time) {
      time = "00:00"
    }
    if (!date) {
      date = new Date()
      date = date.toISOString().slice(0, 10)
    }
    const isoDate = `${date}T${time}:00`
    let dueDate =  new Date(isoDate)
    return dueDate
  }

  const getIntervalFromDate = (date) => {
    const now = new Date()
    const interval = Math.round((date - now) / 60000)
    if (interval > 0) {
      return interval
    } else {
      return null
    }
  }

  const getTimeFromTimestamp = (timestamp) => {
    return timestamp.toISOString.slice(11)
  }

  const getDateFromTimestamp = (timestamp) => {
    return timestamp.toISOString.slice(0, 10)
  }

  const getIntervalInUnits = (interval) => {
    let timeUnits = null
    let timeNum = null
    switch(interval) {
      case interval % 10080 === 0:
        timeNum = interval / 10080
        timeUnits = 'weeks'
        break;
      case interval & 1440 === 0:
        timeNum = interval / 1440
        timeUnits = 'days'
        break;
      case interval % 60 === 0:
        timeNum = interval / 60
        timeUnits = 'minutes'
        break;
      default:
        timeNum = interval
        timeUnits = 'minutes'
    }
    return { timeNum, timeUnits }   
  }

    return { getTimeDue, getInterval, getDate, getIntervalFromDate, getDateFromTimestamp, getTimeFromTimestamp, getIntervalInUnits }

}