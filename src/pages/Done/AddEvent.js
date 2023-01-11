import { db } from '../../firebase/config'
import { collection, addDoc, doc, getDoc, updateDoc,  arrayUnion, Timestamp } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import CreatableSelect from 'react-select/creatable';
import { useDates } from '../../hooks/useDates';

import './Done.css'

export default function AddEvent() {

  const [options, setOptions] = useState(null)
  const [newEvent, setNewEvent] = useState('')
  const [newTags, setNewTags] = useState([])

  const [due, setDue] = useState('')
  const [timeUnits, setTimeUnits] = useState('minutes')

  const { user } = useAuthContext()
  const { getTimeDue } = useDates()
  const { getInterval } = useDates()

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

  const userRef = doc(db, "users", user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault()

    let tags = newTags.map(tag => {
      return {
        value: tag.value,
        label: tag.value
      }
    })

    tags.forEach(async (tag) => {
      await updateDoc(userRef, {
        tags: arrayUnion(tag)
      })
    })

    const timeDue = getTimeDue(due, timeUnits)
    const interval = getInterval(due, timeUnits)

    await addDoc(collection(db, 'events'), {
      event: newEvent,
      completedAt: Timestamp.fromDate(new Date()),
      uid: user.uid,
      tags,
      timeDue,
      interval
    })

    setNewEvent('')
    setDue('')
    setNewTags([])
    setTimeUnits('minutes')
  }

  return (
    <>
    <h2>Add Event</h2>
    
    <div className="p-3 me-3 my-3 shadow add-event border rounded">

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
          onChange= {(option) => setNewTags(option)} 
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
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <select
            value={timeUnits}
            onChange={(e) => setTimeUnits(e.target.value)}
            className="bg-light form-select"
          >
            <option value="minutes">Minutes 
            </option>
            <option value="hours">Hours</option>
            <option value="days">Days </option>
            <option value="weeks">Weeks</option>
          </select>
        </div>

        <button className="btn btn-light border rounded">Add Event</button>
      </form>
    </div>
    </>
  )
}