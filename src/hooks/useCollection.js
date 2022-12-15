import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase/config'

//firebase imports
import { collection, onSnapshot, query, where } from 'firebase/firestore'

export const useCollection = (c, _q) => {
  const [documents, setDocuments] = useState(null)

  //set up query
  const q = useRef(_q).current
  
  useEffect(() => {
    let ref = collection(db, c) // database, collection

    if (q) { // if there's a query
      console.log('query' + q)
      ref = query(ref, where(...q))
    }
    
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      })
      setDocuments(results)
    })

    //unsubscribe when unmounts
    return () => unsub()

  }, [c, q])

return { documents }

}