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

    return { getTimeDue, getInterval }

}