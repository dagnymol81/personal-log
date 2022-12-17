import { db } from '../../firebase/config'
import { doc, deleteDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'

export default function EventList({ events }) {

  const handleClick = async (id) => {
    const ref = doc(db, 'events', id)
    await deleteDoc(ref)
  }

  const [eventsDue, setEventsDue] = useState(null)

  useEffect(() => {
    if (events) {
      setEventsDue(events.filter(event => event.timeDue.toDate() < Date.now()))
    }
    console.log(eventsDue)
  }, [events])


  return (
    <div className="list">

    <h3>Events Due</h3>
    {eventsDue && eventsDue.map(due => (
      <>
      <p>{due.event}</p>
      <p>{due.timeDue.toDate().toDateString()}</p>
      </>
    ))}

    <h3>All Events</h3>

        {events && events.map(done => (
            <div key={done.id} className="card p-3 me-3 my-3 shadow">
              <h5 className="card-title">{done.event}</h5>
              <p>{done.completedAt.toDate().toDateString()}<br />
              {formatDistanceToNow(done.completedAt.toDate(), { addSuffix: true })}</p>
              {done.timeDue && <p>
              Do this again: {done.timeDue.toDate().toDateString()} in {formatDistanceToNow(done.timeDue.toDate())}
              </p>}
              <p>Tags:&nbsp;
                {done.tags && done.tags.map((tag, i) => (
                  <span key={i}>{tag.value} </span>
                ))}
              </p>
              <i className="bi bi-trash3" onClick={() => handleClick(done.id)}></i>            
      </div>
      ))}

    </div>
  )
}
