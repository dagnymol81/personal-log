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

    <div className="container">

    <table className="table">
      <tbody>

      <tr>
          <th scope="column">Event</th>
          <th scope="column">Next Up</th>
          <th scope="column">Last Completed</th>
        </tr>

        <tr>
            <th className="span" colSpan="3" scope="colgroup">It's time!</th>
        </tr>

        {eventsDue && eventsDue.map(due => (
          <tr key={due.id}>
            <td>{due.event}</td>
            <td>
              {formatDistanceToNow(due.timeDue.toDate(), { addSuffix: true })}
            </td>
            <td>
                {due.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                {!isToday(due.completedAt.toDate()) && due.completedAt.toDate().toDateString()}
            </td>
            {/* <td>
              {due.tags && due.tags.map((tag, i) => (
              <span key={i}>{tag.value}&nbsp;</span>))} 
              </td> */}

          </tr>
        ))}
      <tr>
        <th className="span" colSpan="3" scope="colgroup">Coming Attractions</th>
      </tr>
      {upcomingEvents && upcomingEvents.map(coming => (
        <tr key={coming.id}>
          <td>{coming.event}</td>
          <td>{formatDistanceToNow(coming.timeDue.toDate(), { addSuffix: true })}</td>
          <td>
                {coming.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                {!isToday(coming.completedAt.toDate()) && coming.completedAt.toDate().toDateString()}
            </td>
          {/* <td>
             {coming.tags && coming.tags.map((tag, i) => (
            <span key={i}>{tag.value}&nbsp;</span>))} 
            </td> */}

        </tr>
      ))}
      <tr>
        <th className="span" colSpan="3" scope="colgroup">Complete</th>
      </tr>
      {pastEvents && pastEvents.map(event => (
        <tr key={event.id}>
          <td>{event.event}</td>
          <td>It's done! </td>
          <td>
                {event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}
            </td>
          {/* <td>
             {event.tags && event.tags.map((tag, i) => (
            <span key={i}>{tag.value}&nbsp;</span>))} 
            </td> */}
        </tr>
      ))}
    </tbody>
  </table>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

</div>
  )
}
