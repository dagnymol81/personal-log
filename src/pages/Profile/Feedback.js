import {collection, doc, addDoc} from "firebase/firestore"
import { useState } from "react"
import { db } from '../../firebase/config'

export default function Feedback({ user }) {

  const [title, setTitle] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const docRef = await addDoc(collection(db, 'feedback'), {
      title,
      feedback,
      uid: user.uid,
      isNew: true
    })
    console.log("Document written with ID: ", docRef.id);
    alert("Thanks for your feedback")
    setTitle('')
    setFeedback('')
  }

   return (
    <div>
      <h2>Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <input
            className="form-control"
            type="text"
            placeholder="Short Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <textarea
            className="form-control"
            placeholder="Description"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)} 
          />
          <button className="btn btn-light border my-3">Submit Feedback</button>
        </form>
    </div>
  )
}
