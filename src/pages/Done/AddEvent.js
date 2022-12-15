import { db } from '../../firebase/config'
import { collection, addDoc, doc, getDoc, updateDoc,  arrayUnion, Timestamp } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import CreatableSelect from 'react-select/creatable';

export default function AddEvent({ events }) {

  // const options = [
  //   { value: 'blues', label: 'Blues' },
  //   { value: 'rock', label: 'Rock' },
  //   { value: 'jazz', label: 'Jazz' },
  //   { value: 'orchestra', label: 'Orchestra' } 
  // ];

  const [options, setOptions] = useState(null)
 
 
  const [newEvent, setNewEvent] = useState('')
  const [newTags, setNewTags] = useState([])
  const { user } = useAuthContext()

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

    await addDoc(collection(db, 'events'), {
      event: newEvent,
      completedAt: Timestamp.fromDate(new Date()),
      uid: user.uid,
      tags
    })


    setNewEvent('')
  }

  return (
    <div className="p-3 me-3 my-3 shadow add-event border rounded">
      <form onSubmit={handleSubmit} className="add-event-form">
        <input 
          list="pastEvents"
          id="newEvent"
          placeholder="Add Event"
          onChange={(e) => setNewEvent(e.target.value)}
          value={newEvent}
        />
        <datalist id="pastEvents">
          {events && events.map(done => (
            <option value={done.event} key={done.id} />
          ))}
        </datalist>

      {options && <CreatableSelect 
          onChange= {(option) => setNewTags(option)} 
          options={options} 
          isMulti 
        />}

        <button className="btn btn-light border rounded">Add Event</button>
      </form>
    </div>
  )
}
