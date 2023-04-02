import React, { useState, useEffect, useContext, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../firebase';
// import emailjs from '@emailjs/browser';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import UserContext from './UserContext';
import './AddStudent.css'

function AddStudent(props) {
    const [students, setStudents] = useContext(UserContext).allStudents;
    const [mentorAccess, setMentorAccess] = useContext(UserContext).access;
    const [uid, setUid] = useState('');
    const [ideation, setIdeation] = useState();
    const [execution, setExecution] = useState();
    const [viva, setViva] = useState();
    const [studentData, setStudentData] = useContext(UserContext).selectedStudents;
    const currentMentor = `mentor${props.id}`;
    const form = useRef();

//     const sendEmail = (e) => {
//     e.preventDefault();

//     emailjs.send(process.env.EMAILSERVICE, process.env.EMAILTEMPLATE, form.current, process.env.EMAILKEY)
//       .then((result) => {
//           console.log(result.text);
//       }, (error) => {
//           console.log(error.text);
//       });
//   };

    const fetchPost = async () => {

        await getDocs(collection(db, `students`))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setStudents(newData);
            })

        await getDocs(collection(db, currentMentor ))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setStudentData(newData);
            })

    }

    useEffect(() => {
        fetchPost();
    }, [props.id]);

    const handleSubmit = async() => {
        // if (studentData.length < 3) {
        //     alert("Add More Students");
        // }
        // else if (studentData.length > 4) {
        //     alert("Remove Some Students");
        // }
        // else {
            alert("Submitted Successfully");
            setMentorAccess(preVal => ({
                ...preVal,
                [currentMentor] : false
            }));
            // studentData.map((value) => {
            //     sendEmail(studentData);
            // })
        // }
    }

    async function handleAddStudent() {
        const student = students.find(student => student.uid === uid);
        if (!student) {
            alert("Student Not Found");
            return;
        }
        if ((ideation > 10 || ideation < 0) || (execution > 10 || execution < 0) || (viva > 10 || viva < 0)) {
            alert("Please Enter Marks in range of 1-10");
            return;
        }
        student.ideation = ideation;
        student.execution = execution;
        student.viva = viva;
        // Delete the student from the 'students' collection in Firestore
        const docRef = doc(db, "students", `${student.id}`);

        await deleteDoc(docRef)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })

        // Remove the student object from the 'students' array
        const newStudents = students.filter(s => s.id !== student.id);
        setStudents(newStudents);

        // Add the student object to the 'mentor1' collection in Firestore
        try {
            const docRef = await addDoc(collection(db, currentMentor ), student);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        // Add the student object to the 'studentData' array
        setStudentData([...studentData, student]);

        setUid('');
        setIdeation(0);
        setExecution(0);
        setViva(0);
        fetchPost();
    }

    async function handleUpdateStudent() {
        const student = studentData.find(student => student.uid === uid);
        if (!student) {
            return;
        }
        if ((ideation > 10 || ideation < 0) || (execution > 10 || execution < 0) || (viva > 10 || viva < 0)) {
            alert("Please Enter Marks in range of 1-10");
            return;
        }
        student.ideation = ideation;
        student.execution = execution;
        student.viva = viva;

        // Delete the student from the 'mentor' collection in Firestore
        const docRef = doc(db, currentMentor , `${student.id}`);

        await deleteDoc(docRef)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })

        try {
            const docRef = await addDoc(collection(db, currentMentor ), student);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        const newStudents = studentData.filter(s => s.uid !== uid);
        setStudentData([... newStudents, student]);

        fetchPost();
    }

    const AddUpdateStudent = async(student) => {
        setUid(student.uid);
        setIdeation(student.ideation);
        setExecution(student.execution);
        setViva(student.viva);
    }

    const handleDeleteStudent = async (student) => {

        student.ideation = "-";
        student.execution = "-";
        student.viva = "-";
        // Add the student object to the 'students' collection in Firestore
        try {
            const docRef = await addDoc(collection(db, `students`), student);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        // Add the student object to the 'studentData' array
        setStudents([...students, student]);


        // Delete the student from the 'mentor' collection in Firestore
        const docRef = doc(db, currentMentor , `${student.id}`);

        await deleteDoc(docRef)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })

        // Remove the student object from the 'mentor' array
        const newStudents = studentData.filter(s => s.id !== student.id);
        setStudentData(newStudents);



        setUid('');
        setIdeation(0);
        setExecution(0);
        setViva(0);
        fetchPost();
    }

    let selectedStudents = studentData.map(student => (
        <tr key={student.id}>
            <td data-label="UID">{student.uid}</td>
            <td data-label="Name">{student.name}</td>
            <td data-label="Ideation">{student.ideation}</td>
            <td data-label="Execution">{student.execution}</td>
            <td data-label="Viva">{student.viva}</td>
            <td data-label="Total">{parseInt(student.ideation) + parseInt(student.execution) + parseInt(student.viva)}</td>
            <td data-label="Email">{student.email}</td>
            <td data-label="Delete">
                <button onClick={() => handleDeleteStudent(student)} disabled = {!mentorAccess[currentMentor]}>Delete</button>
            </td>
            <td data-label="Update">
                <button onClick={() => AddUpdateStudent(student)} disabled = {!mentorAccess[currentMentor]}>Update</button>
            </td>
        </tr>
    ));

    if (selectedStudents.length == 0) selectedStudents = <p style = {{alignSelf : 'center'}}>No Students Selected</p>
    return (
        <div className="table-box">
            <div className="table-container">
                <table className="table">
                    <caption className="heading">Selected Student's List</caption>
                    <thead>
                        <tr>
                            <th>UID</th>
                            <th>Name</th>
                            <th>Ideation</th>
                            <th>Execution</th>
                            <th>Viva</th>
                            <th>Total</th>
                            <th>Email</th>
                            <th>Delete</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedStudents}
                    </tbody>
                </table>
                <div className="contain2">
                    <div className="contain">
                        <div className="main-user-info">
                            <div className="user-input-box">
                                <label htmlFor="uid">UID:</label>
                                <input type="text" id="uid" value={uid} onChange={event => setUid(event.target.value)} />
                            </div>
                            <div className="user-input-box">
                                <label htmlFor="ideation">Ideation:</label>
                                <input type="number" id="ideation" min = "0" max = "10" value={ideation} onChange={event => setIdeation(event.target.value)} />
                            </div>

                            <div className="user-input-box">
                                <label htmlFor="execution">Execution:</label>
                                <input type="number" id="execution" min = "0" max = "10" value={execution} onChange={event => setExecution(event.target.value)} />
                            </div>

                            <div className="user-input-box">
                                <label htmlFor="viva">Viva:</label>
                                <input type="number" id="viva" min = "0" max = "10" value={viva} onChange={event => setViva(event.target.value)} />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" disabled = {!mentorAccess[currentMentor]} onClick={handleAddStudent} value="Select Student" />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" onClick={handleSubmit} value="Final Submit" />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" disabled = {!mentorAccess[currentMentor]} onClick={handleUpdateStudent} value="Update Student" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AddStudent;
