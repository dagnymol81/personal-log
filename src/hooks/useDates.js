import add from 'date-fns/add'

export const useDates = () => {

  const getTimeDue = (due, units) => {
    let timeDue = null
    switch (units) {
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
    return timeDue
  }
    return { getTimeDue }

}