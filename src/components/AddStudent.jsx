import React, { useState, useEffect, useContext, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from './UserContext';
import './AddStudent.css'
import jsPDF from 'jspdf';
import "jspdf-autotable";

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
    let isDeletingStudent = false;
    let isSelectingStudent = false;

    const fetchPost = async () => {

        await getDocs(collection(db, `students`))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setStudents(newData);
            })

        await getDocs(collection(db, currentMentor))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setStudentData(newData);
            })

    }

    useEffect(() => {
        fetchPost();
    }, [props.id]);

    const sendEmail = (data) => {

        emailjs.send('service_mer5z2u', 'template_ebbc009', data, 'K5CPrxXVyd3QyvL6p')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

        toast.success(`Email Sent to ${data.name} Successfully`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const handleSubmit = async () => {
        if (studentData.length < 3) {
            toast.warn('Add More Students(minimum students 3)', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else if (studentData.length > 4) {
            toast.warn('Remove Some Students(maximum students 4)', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
            let flag = true;
            studentData.map((value) => {
                if (value.ideation < 0 || value.ideation > 10 || value.ideation == '-') flag = false;
                if (value.execution < 0 || value.execution > 10 || value.execution == '-') flag = false;
                if (value.viva < 0 || value.viva > 10 || value.viva == '-') flag = false;
            })
            if (flag) {

                toast.success('Submitted Successfully', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setMentorAccess(preVal => ({
                    ...preVal,
                    [currentMentor]: false
                }));
                // studentData.map((value) => {
                //     sendEmail(value);
                // })

                const doc = new jsPDF();
                const headers = [["UID", "Name", "Ideation", "Execution", "Viva", "Email"]];
                // Add title for first table
                doc.text("All Students", 14, 16);

                const AllStudentdata = students.map(row => [row.uid, row.name, row.ideation, row.execution, row.viva, row.email]);
                doc.autoTable({
                    head: headers,
                    body: AllStudentdata,
                });

                // Add title for second table
                doc.text("Selected Students", 14, doc.lastAutoTable.finalY + 10);

                const selectedData = studentData.map(row => [row.uid, row.name, row.ideation, row.execution, row.viva, row.email]);
                doc.autoTable({
                    head: headers,
                    body: selectedData,
                    startY: doc.lastAutoTable.finalY + 20
                });

                doc.save("student-data.pdf");
            }
            else {
                toast.warn('Please enter valid marks', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    }

    async function handleAddStudent() {
        const student = students.find(student => student.uid === uid);
        if (!student) {
            toast.info('Student Not Found', {
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
        if (isSelectingStudent) {
            toast.warn('Student Already Selected', {
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
        isSelectingStudent = true;
        if ((ideation > 10 || ideation < 0) || (execution > 10 || execution < 0) || (viva > 10 || viva < 0)) {
            toast.info('Please Enter Marks in range of 1-10', {
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
            const docRef = await addDoc(collection(db, currentMentor), student);
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
        toast.success('Selected Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        isSelectingStudent = false;
    }

    async function handleUpdateStudent() {
        const student = studentData.find(student => student.uid === uid);
        if (!student) {
            return;
        }
        if ((ideation > 10 || ideation < 0) || (execution > 10 || execution < 0) || (viva > 10 || viva < 0)) {
            toast.info('Marks range is 1-10', {
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
        student.ideation = ideation;
        student.execution = execution;
        student.viva = viva;

        // Delete the student from the 'mentor' collection in Firestore
        const docRef = doc(db, currentMentor, `${student.id}`);

        await deleteDoc(docRef)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
            .catch(error => {
                console.log(error);
            })

        try {
            const docRef = await addDoc(collection(db, currentMentor), student);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        const newStudents = studentData.filter(s => s.uid !== uid);
        setStudentData([...newStudents, student]);

        fetchPost();
    }

    const AddUpdateStudent = async (student) => {
        setUid(student.uid);
        setIdeation(student.ideation);
        setExecution(student.execution);
        setViva(student.viva);
    }

    const handleDeleteStudent = async (student) => {

        if (isDeletingStudent) {
            toast.warn('Already Deleted', {
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
        isDeletingStudent = true;
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
        const docRef = doc(db, currentMentor, `${student.id}`);

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
        toast.success('Deleted Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        isDeletingStudent = false;
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
                <button onClick={() => handleDeleteStudent(student)} disabled={!mentorAccess[currentMentor]} className="btn btn-danger">Delete</button>
            </td>
            <td data-label="Update">
                <button onClick={() => AddUpdateStudent(student)} disabled={!mentorAccess[currentMentor]} className="btn btn-success">Update</button>
            </td>
        </tr>
    ));

    if (selectedStudents.length == 0) selectedStudents = <p style={{ alignSelf: 'center' }}>No Students Selected</p>
    return (
        <div className="tables-box">
            <div className="tables-container">
                <h1 className="headings">Selected Student's List</h1>
                <table className="tables">
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
                                <input type="number" id="ideation" min="0" max="10" value={ideation} onChange={event => setIdeation(event.target.value)} />
                            </div>

                            <div className="user-input-box">
                                <label htmlFor="execution">Execution:</label>
                                <input type="number" id="execution" min="0" max="10" value={execution} onChange={event => setExecution(event.target.value)} />
                            </div>

                            <div className="user-input-box">
                                <label htmlFor="viva">Viva:</label>
                                <input type="number" id="viva" min="0" max="10" value={viva} onChange={event => setViva(event.target.value)} />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" disabled={!mentorAccess[currentMentor]} onClick={handleAddStudent} value="Select Student" />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" onClick={handleSubmit} value="Final Submit" />
                            </div>
                            <div className="form-submit-btn">
                                <input type="submit" disabled={!mentorAccess[currentMentor]} onClick={handleUpdateStudent} value="Update Student" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AddStudent;
