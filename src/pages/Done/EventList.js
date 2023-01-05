import { db } from '../../firebase/config'
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'
import { isToday } from 'date-fns'
import add from 'date-fns/add'

export default function EventList({ events }) {

  const [event, setEvent] = useState(null)

  const deleteItem = async (id) => {
    const ref = doc(db, 'events', id)
    await deleteDoc(ref)
  }

  const repeatTask = async(event) => {
    const ref = doc(db, 'events', event.id)
    const newDueDate = add(new Date(), {
      minutes: event.interval
    })
    await updateDoc(ref, {
      timeDue: newDueDate
    })
  }

  const markComplete = async(event) => {
    const ref = doc(db, 'events', event.id)
    await updateDoc(ref, {
      timeDue: null,
      interval: null
    })
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
          <div key={due.id} className="event-listing">
            <div className="event"><h3>{due.event}</h3></div>
            <div className="event-details">
              <div className="time">
                <div>
                  <strong>Last Completed: </strong>{isToday(due.completedAt.toDate()) && due.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
                  {!isToday(due.completedAt.toDate()) && due.completedAt.toDate().toDateString()}<br />
                  <strong>Next Up: </strong>{formatDistanceToNow(due.timeDue.toDate(), { addSuffix: true })}<br />
                  <strong>Tags: </strong>{due.tags && due.tags.map((tag, i) => (
                  <span key={i}>{tag.value}&nbsp;</span>))} 
                </div>
              </div>
              <div className="icons">
                <i className="bi bi-check2-circle" onClick={() => markComplete(due)}></i>
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(due)}></i>
              </div>
            </div>
          </div>
        ))}
      <div>
        <div className="span">Coming Attractions</div>
      </div>
      {upcomingEvents && upcomingEvents.map(coming => (
        <div key={coming.id}  className="event-listing">
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
        <div key={event.id}  className="event-listing">
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
