import { db } from '../../firebase/config'
import { doc, deleteDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'
import { isToday } from 'date-fns'


export default function EventList({ events }) {

  const deleteItem = async (id) => {
    const ref = doc(db, 'events', id)
    await deleteDoc(ref)
  }

  const [eventsDue, setEventsDue] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState(null)
  const [pastEvents, setPastEvents] = useState(null)

  useEffect(() => {
    if (events) {
      let timedEvents = events.filter(event => event.timeDue)
      setEventsDue(timedEvents.filter(event => event.timeDue.toDate() < Date.now()).sort((a, b) => {return a.timeDue.toDate() - b.timeDue.toDate()}))
      setUpcomingEvents(timedEvents.filter(event => event.timeDue.toDate() > Date.now()).sort((a, b) => {return a.timeDue.toDate() - b.timeDue.toDate()}))
      setPastEvents(events.filter(event => !event.timeDue))
    }
    
  }, [events])


  return (

    <div className="event-list">

        {eventsDue && eventsDue.map(due => (
          <div key={due.id} className="event-listing"  data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip">
            <div className="event"><h3>{due.event}</h3></div>


            <div className="time">
            <div>
            <strong>Last Completed: </strong>{isToday(due.completedAt.toDate()) && due.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
            {!isToday(due.completedAt.toDate()) && due.completedAt.toDate().toDateString()}<br />
            <strong>Next Up: </strong>{formatDistanceToNow(due.timeDue.toDate(), { addSuffix: true })}<br />
            <strong>Tags: </strong>{due.tags && due.tags.map((tag, i) => (
            <span key={i}>{tag.value}&nbsp;</span>))} 
            </div>
            </div>



          </div>
        ))}
      <div>
        <div className="span">Coming Attractions</div>
      </div>
      {upcomingEvents && upcomingEvents.map(coming => (
        <div key={coming.id}>
          <div>{coming.event}</div>
          <div>{formatDistanceToNow(coming.timeDue.toDate(), { addSuffix: true })}</div>
          <div>
                {coming.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                {!isToday(coming.completedAt.toDate()) && coming.completedAt.toDate().toDateString()}
            </div>

        </div>
      ))}
      <div>
        <div>Complete</div>
      </div>
      {pastEvents && pastEvents.map(event => (
        <div key={event.id}>
          <div>{event.event}</div>
          <div>It's done! </div>
          <div>
                {event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}
            </div>
        </div>
      ))}
    </div>
  )
}
