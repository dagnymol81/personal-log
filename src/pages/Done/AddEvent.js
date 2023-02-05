import { db } from '../../firebase/config'
import { collection, addDoc, doc, getDoc, Timestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import CreatableSelect from 'react-select/creatable';
import { useDates } from '../../hooks/useDates';
import { Form, Button, InputGroup } from 'react-bootstrap';


export default function AddEvent({ event, handleClose }) {

  const [options, setOptions] = useState(null)
  const [newEvent, setNewEvent] = useState('')
  const [newTags, setNewTags] = useState([])
  const [timeNum, setTimeNum] = useState('')
  const [timeUnits, setTimeUnits] = useState('minutes')
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  const { user } = useAuthContext()

  const { getTimeDue, getInterval,  getDate, getIntervalFromDate, } = useDates()

  const userRef = doc(db, "users", user.uid);

  const handleTags = (option) => {
    const _newTags = option.map((element) => {
      element = {
        label: element.label,
        value: element.value
      }
      return element
    })
    setNewTags(_newTags)
  }

  useEffect(() => {
    if (event) {
      setNewEvent(event.event)
      setNewTags(event.tags)
    }
  }, [event])

  useEffect(() => {
    async function fetchUserDoc()  {
       const docRef = doc(db, 'users', user.uid)
       const docSnap = await getDoc(docRef)
       if (docSnap.exists()) {
        let userData = docSnap.data()
        setOptions(userData.tags)
       } else {
         // doc.data() will be undefined in this case
         console.log("No such document!");
       }
     }
     fetchUserDoc()
    }, [user.uid])

  const handleSubmit = async (e) => {
    e.preventDefault()

    let timeDue = null
    if (timeNum) {
      timeDue = getTimeDue(timeNum, timeUnits)
    } else if (time || date) {
      timeDue = getDate(date, time)
    }

    let interval = null
    if (timeNum) {
      interval = getInterval(timeNum, timeUnits)
    } else if (time || date) {
      const dueDate = getDate(date, time)
      interval = getIntervalFromDate(dueDate)
    }

    const userTags = options.concat(newTags.filter((item) => newTags.indexOf(item) < 0))

    await updateDoc(userRef, { tags: userTags })

    if (event) {
      const eventRef = doc(db, "events", event.id)
      await updateDoc(eventRef, {
        event: newEvent,
        tags: newTags,
        timeDue,
        interval
      })
      handleClose()
    } else {
    await addDoc(collection(db, 'events'), {
      event: newEvent,
      completedAt: Timestamp.fromDate(new Date()),
      uid: user.uid,
      tags: newTags,
      timeDue,
      interval
    })
    }

    setNewEvent('')
    setTimeNum('')
    setNewTags([])
    setTimeUnits('minutes')
    setTime('')
    setDate('')
  }

  return (
    <>
   
    <div className="add-event">

      <Form className="add-event-form">
    
        <Form.Group className="my-2">
          <Form.Control 
            type="text"
            placeholder="Add Event"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
        </Form.Group>

      <Form.Group  className="my-2">
      {options && <CreatableSelect 
          onChange= {(option) => handleTags(option)} 
          value={newTags}
          options={options} 
          isMulti 
        />}
      </Form.Group>

      <InputGroup  className="my-2">
      <InputGroup.Text>Remind Me In: </InputGroup.Text>
          <Form.Control 
            type="text"
            value={timeNum}
            onChange={(e) => {
              setTimeNum(e.target.value)
            }}
          />
      <InputGroup.Text>&nbsp;</InputGroup.Text>
          <Form.Select 
            id="timeUnits"
            value={timeUnits}
            onChange={(e) => {
              setTimeUnits(e.target.value)
            }}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days </option>
            <option value="weeks">Weeks</option>
          </Form.Select>
      </InputGroup>

      <InputGroup  className="my-2">
        <InputGroup.Text>Remind Me At: </InputGroup.Text>
        <Form.Control 
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value)
          }}
        />
        <InputGroup.Text>&nbsp;</InputGroup.Text>
        <Form.Control 
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
          }}
        />
      </InputGroup>

        <Button variant="secondary" onClick={handleSubmit}>Add Event</Button>

      </Form>
    </div>
    </>
  )
}