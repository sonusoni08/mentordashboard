import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import UserContext from './UserContext';
import { Link } from "react-router-dom";
import './AddStudent.css'

function AddMoreStudent() {

    const { allStudents, selectedStudents, access } = useContext(UserContext);

    const [students, setStudents] = allStudents;
    const [studentData, setStudentData] = selectedStudents;
    const [mentorAccess, setMentorAccess] = access;

    const [uid, setUid] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');


    const fetchPost = async () => {

        await getDocs(collection(db, `students`))
        .then((querySnapshot) => {
            const newData = querySnapshot.docs
                .map((doc) => ({ ...doc.data(), id: doc.id }));
            setStudents(newData);
        })
    }

    const handleAddStudent = async() => {
        const student = {uid : uid, name : name, email : email, ideation : "-", execution : "-", viva : "-"};
        try {
            const docRef = await addDoc(collection(db, "students" ), student);
            console.log("Document written with ID: ", docRef.id);
            fetchPost();
            console.log(students);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

  return (
    <div className="contain2">
        <div className="contain">
            <div className="main-user-info">
                <div className="user-input-box">
                    <label htmlFor="uid">UID:</label>
                    <input type="text" id="uid" value={uid} onChange={event => setUid(event.target.value)} />
                </div>
                <div className="user-input-box">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={event => setName(event.target.value)} />
                </div>
                <div className="user-input-box">
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" value={email} onChange={event => setEmail(event.target.value)} />
                </div>
                <div>
                <Link to = "/mentor1"><button type="submit" onClick={handleAddStudent}  className="btn btn-primary">Add Student</button></Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddMoreStudent