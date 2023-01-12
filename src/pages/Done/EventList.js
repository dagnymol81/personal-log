import { db } from '../../firebase/config'
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'
import { isToday } from 'date-fns'
import add from 'date-fns/add'
import AddEvent from './AddEvent'

export default function EventList({ events }) {

  const deleteItem = async (id) => {
    console.log('id: ' + id)
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
  const [event, setEvent] = useState(null)

  const handleModal = (event) => {
    setEvent(event)
  }


  useEffect(() => {
    if (events) {
      let timedEvents = events.filter(event => event.timeDue)
      setEventsDue(timedEvents.filter(event => event.timeDue.toDate() < Date.now()).sort((b, a) => {return a.timeDue.toDate() - b.timeDue.toDate()}))
      setUpcomingEvents(timedEvents.filter(event => event.timeDue.toDate() > Date.now()).sort((a, b) => {return a.timeDue.toDate() - b.timeDue.toDate()}))
      setPastEvents(events.filter(event => !event.timeDue))
    }
    
  }, [events])


  return (

    <div className="event-list">

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-body">
        <h3>Editing: {event.event}</h3>
        <AddEvent 
          event={event}
          />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

      <h2>Current Events</h2>

        {eventsDue && eventsDue.map(event => (
          <div key={event.id} className="event-listing">
            <h3>{event.event}</h3>
            <div className="event-details">
              <div className="time">
                <div>
                  <strong>Last Completed: </strong>{isToday(event.completedAt.toDate()) && event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
                  {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}<br />
                  <strong>Next Up: </strong>{formatDistanceToNow(event.timeDue.toDate(), { addSuffix: true })}<br />
                  <strong>Tags: </strong>{event.tags && event.tags.map((tag, i) => (
                  <span key={i}>{tag.value}&nbsp;</span>))} 
                </div>
              </div>
              <div className="icons">
                <i className="bi bi-check2-circle" onClick={() => markComplete(event)}></i>
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(event)}></i>
                <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleModal(event)}></i>
              </div>
            </div>
          </div>
        ))}

      <h2>Coming Attractions</h2>

      {upcomingEvents && upcomingEvents.map(event => (
        <div key={event.id}  className="event-listing">
          <h3>{event.event}</h3>
          <div className="event-details">
            <div>
            <strong>Last Completed: </strong> 
            {event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
            {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}<br />
            <strong>Next Up: </strong>
            {formatDistanceToNow(event.timeDue.toDate(), { addSuffix: true })}<br />
            <strong>Tags: </strong>{event.tags && event.tags.map((tag, i) => (
            <span key={i}>{tag.value}&nbsp;</span>))} 
            </div>
            <div className="icons">
                <i className="bi bi-check2-circle" onClick={() => markComplete(event)}></i>
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(event)}></i>
                <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleModal(event)}></i>
            </div>
        </div>
      </div>
      ))}

      <h2>Complete</h2>

      {pastEvents && pastEvents.map(event => (
        <div key={event.id}  className="event-listing">
          <h3>{event.event}</h3>
          <div className="event-details">
          <div>
            <strong>Last Completed: </strong>{event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
            {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}<br />
            <strong>Tags: </strong>{event.tags && event.tags.map((tag, i) => (
            <span key={i}>{tag.value}&nbsp;</span>))} 
            </div>
          <div className="icons">
            <i className="bi bi-x-circle" onClick={() => deleteItem(event.id)}></i>
            <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal"  onClick={() => handleModal(event)}></i>
          </div>
          </div>
        </div>
      ))}
    </div>
  )
}
