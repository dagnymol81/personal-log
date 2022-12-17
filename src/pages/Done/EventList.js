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
  const [upcomingEvents, setUpcomingEvents] = useState(null)

  useEffect(() => {
    if (events) {
      setEventsDue(events.filter(event => event.timeDue.toDate() < Date.now()))
      setUpcomingEvents(events.filter(event => event.timeDue.toDate() > Date.now()))
    }
    
  }, [events, eventsDue])


  return (

    <div className="container">

<div className="accordion" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        It's time!
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div className="accordion-body">

      {eventsDue && eventsDue.map(due => (
      <>
      <p>{due.event}&nbsp;
      {formatDistanceToNow(due.timeDue.toDate(), { addSuffix: true })}&nbsp;
      {due.tags && due.tags.map((tag, i) => (
        <span key={i}>{tag.value} </span>
      ))}
      </p>
      </>

    ))}

      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Coming Attractions
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div className="accordion-body">

      {upcomingEvents && upcomingEvents.map(coming => (
      <>
      <p>{coming.event}&nbsp;
      {formatDistanceToNow(coming.timeDue.toDate(), { addSuffix: true })}&nbsp;
      {coming.tags && coming.tags.map((tag, i) => (
        <span key={i}>{tag.value} </span>
      ))}
      </p>
      </>

    ))}

      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingThree">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Everything
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div className="accordion-body">

      {events && events.map(event => (
      <>
      <p>{event.event}&nbsp;
      {formatDistanceToNow(event.timeDue.toDate(), { addSuffix: true })}&nbsp;
      {event.tags && event.tags.map((tag, i) => (
        <span key={i}>{tag.value} </span>
      ))}
      </p>
      </>

    ))}

      </div>
    </div>
  </div>
</div>

    {/* <div className="list">

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

    </div> */}
    </div>
  )
}
