import { db } from '../../firebase/config'
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useEffect, useState } from 'react'
import { isToday } from 'date-fns'
import add from 'date-fns/add'
import AddEvent from './AddEvent'
import { Button, Modal, Card, Row, Col } from 'react-bootstrap'

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [edit, setEdit] = useState(false)

  const handleShow = async (event) => {
    setEvent(event);
    setEdit(true)
    setShow(true);
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

      {event && edit &&
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><h3>Editing: {event.event}</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEvent 
            event={event}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>}

      <h2>Current Events</h2>

      {eventsDue && eventsDue.map(event => (
        <Card key={event.id} className="my-5 shadow">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>{event.event}</Card.Title>
                <Card.Text>
                <strong>Last Completed: </strong>
                  {isToday(event.completedAt.toDate()) && event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
                  {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}
                  &nbsp;({formatDistanceToNow(event.completedAt.toDate(), {addSuffix: true})})
                  <br />
                <strong>Next Up: </strong>
                  {isToday(event.completedAt.toDate()) && event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
                  {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}
                  &nbsp;({formatDistanceToNow(event.timeDue.toDate(), { addSuffix: true })})
                </Card.Text>
              </Col>
              <Col md="auto">
                <i className="bi bi-check2-circle" onClick={() => markComplete(event)} aria-label="Mark Complete"></i>
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(event)} aria-label="Repeat Task"></i>
                <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow(event)}aria-label="Edit Task"></i>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <h2>Coming Attractions</h2>

      {upcomingEvents && upcomingEvents.map(event => (
        <Card key={event.id} className="my-5 shadow">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>{event.event}</Card.Title>
                <Card.Text>
                  <strong>Last Completed: </strong> 
                    {event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}
                    {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}<br />
                  <strong>Next Up: </strong>
                    {formatDistanceToNow(event.timeDue.toDate(), { addSuffix: true })}<br />
                </Card.Text>
              </Col>
              <Col md="auto">
                <i className="bi bi-check2-circle" onClick={() => markComplete(event)} aria-label="Mark Complete"></i>
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(event)} aria-label="Repeat Task"></i>
                <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow(event)} aria-label="Edit Task"></i>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <h2>Complete</h2>
      
        {pastEvents && pastEvents.map(event => (
          <Card key={event.id} className="my-5 shadow">
          <Card.Body>
            <Row>
              <Col>
                <Card.Title>{event.event}</Card.Title>
                <Card.Text>
                <strong>Last Completed: </strong>{event.completedAt.toDate().toLocaleTimeString('en-US', {timeStyle: "short"})}&nbsp;
                  {!isToday(event.completedAt.toDate()) && event.completedAt.toDate().toDateString()}<br />
                </Card.Text>
              </Col>
              <Col md="auto">
                <i className="bi bi-arrow-repeat" onClick={() => repeatTask(event)} aria-label="Repeat Task"></i>
                <i className="bi bi-pencil-square"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow(event)} aria-label="Edit Task"></i>
                <i className="bi bi-x-circle" onClick={() => deleteItem(event.id)} aria-label="Delete Item"></i>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

    </div>
  )
}
