import { db } from '../../firebase/config'
import { collection, addDoc, doc, getDoc, Timestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import CreatableSelect from 'react-select/creatable';
import { useDates } from '../../hooks/useDates';

import './Done.css'

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
    setNewTags(option)
    setOptions([...option, ...options])
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

    const userTags = options.map((element) => {
      element = {
        label: element.label,
        value: element.value
      }
      return element
    })

    const eventTags = newTags.map((element) => {
      element = {
        label: element.label,
        value: element.value
      }
      return element
    })

    setDoc(userRef, { tags: userTags }, { merge: true })

    if (event) {
      const eventRef = doc(db, "events", event.id)
      await updateDoc(eventRef, {
        event: newEvent,
        tags: eventTags,
        timeDue,
        interval
      })
      handleClose()
    } else {
    await addDoc(collection(db, 'events'), {
      event: newEvent,
      completedAt: Timestamp.fromDate(new Date()),
      uid: user.uid,
      tags: eventTags,
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

      <form onSubmit={handleSubmit} className="add-event-form">

        <div>
        <input 
          className="form-control"
          type="text"
          placeholder="Add Event"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
        />
        </div>
      
      <div className="tags">
      <span className="input-group-text bg-light">Tags: </span>
      {options && <CreatableSelect 
          onChange= {(option) => handleTags(option)} 
          value={newTags}
          options={options} 
          isMulti 
          className="form-input"
        />}
      </div>

        <div className="input-group">
        <span className="input-group-text bg-light">Remind me again in: </span> 
          <input 
            type="text"
            value={timeNum}
            onChange={(e) => {
              setTimeNum(e.target.value)
            }}
          />
          <select
            id="timeUnits"
            value={timeUnits}
            onChange={(e) => {
              setTimeUnits(e.target.value)
            }}
            className="bg-light form-select"
          >
            <option value="minutes">Minutes 
            </option>
            <option value="hours">Hours</option>
            <option value="days">Days </option>
            <option value="weeks">Weeks</option>
          </select>
        </div>

        <div className="input-group">
        <span className="input-group-text bg-light">Remind me at: </span> 
          <input 
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value)
            }}
            className="form-input"
          />
          <span className="input-group-text bg-light">&nbsp;</span> 
          <input 
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
            }}
            className="form-input"
          />
          <span className="input-group-text bg-light">&nbsp;</span> 
        </div>

        <button className="btn btn-light border rounded">Add Event</button>
      </form>
    </div>
    </>
  )
}