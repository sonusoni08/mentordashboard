import React, { useState } from 'react'
import UserContext from './UserContext'

function UserProvider({children}) {
    const [students, setStudents] = useState([{uid : "", name : "", ideation : 0, execution : 0, viva : 0, email: ""}]);
    const [studentData, setStudentData] = useState([]);
    const [mentorAccess, setMentorAccess] = useState({mentor1 : true, mentor2 : true});
    
    return (
    <UserContext.Provider value = {{allStudents : [students, setStudents], selectedStudents :[studentData, setStudentData], access : [mentorAccess, setMentorAccess]}}>
        {children}
    </UserContext.Provider>
  )
}
export default UserProvider;