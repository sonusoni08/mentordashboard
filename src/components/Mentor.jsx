import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import React, { useState, useEffect, useContext } from 'react';
import AddStudent from "./AddStudent";
import UserContext from './UserContext';
import { Link } from "react-router-dom";
import "./Mentor.css"
import AddMoreStudent from "./AddMoreStudent"
import NavBar from "./NavBar";
import { ToastContainer, toast } from 'react-toastify';

function Mentor(props) {
    const { allStudents, selectedStudents, access } = useContext(UserContext);

    const [students, setStudents] = allStudents;
    const [studentData, setStudentData] = selectedStudents;
    const [mentorAccess, setMentorAccess] = access;
    const currentMentor = `mentor${props.id}`;
    let isAddingStudent = false;

    const fetchPost = async () => {

        await getDocs(collection(db, `students`))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                console.log(newData);
                setStudents(newData);
            })

        await getDocs(collection(db, `mentor${props.id}`))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                console.log(newData);
                setStudentData(newData);
            })

        console.log(students);
        console.log(studentData);
    }


    async function handleAddStudent(student) {

        if (isAddingStudent) {
            // The function is already running, so don't do anything
            toast.warn('Already Added', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        toast.success('Added Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        isAddingStudent = true;
        // Delete the student from the 'students' collection in Firestore
        const docRef = doc(db, "students", `${student.id}`);

        await deleteDoc(docRef)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })

        // Add the student object to the 'mentor1' collection in Firestore
        try {
            const docRef = await addDoc(collection(db, currentMentor), student);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        fetchPost();
        isAddingStudent = false;

    }


    useEffect(() => {
        fetchPost();
    }, [props.id])

    const handleSubmit = async () => {
        fetchPost();
    }


    const data = students.map((val) => {
        return (<tr key={val.id}>
            <td data-label="UID">{val.uid}</td>
            <td data-label="Name">{val.name}</td>
            <td data-label="Ideation">{val.ideation}</td>
            <td data-label="Execution">{val.execution}</td>
            <td data-label="Viva">{val.viva}</td>
            <td data-label="Email">{val.email}</td>
            <td data-label="Action"><button onClick={() => handleAddStudent(val)} disabled={!mentorAccess[currentMentor]} className="btn btn-primary">Select Student</button></td>
        </tr>)
    })

    return (
        <>
            <NavBar id={props.id} />
            <div className="tables-box">
                <div className="tables-container">
                    <h1 className="headings justify-content-center">Available Students</h1>
                    <table className="tables">
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Name</th>
                                <th>Ideation</th>
                                <th>Execution</th>
                                <th>Viva</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data}
                        </tbody>
                    </table>
                    <div style={{ fontSize: "1.5em", margin: "2rem 0 0 43%" }}>
                        <Link to={currentMentor} onClick={handleSubmit}>
                            <Link to="/addstudent">
                                <button class="btn btn-primary">Add Student</button>
                            </Link>
                        </Link>
                    </div>
                    <AddStudent id={props.id} />
                </div>
            </div>
        </>
    )
}

export default Mentor
