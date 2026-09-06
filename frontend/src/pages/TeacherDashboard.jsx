import { useState, useEffect } from 'react'
import api from '../api.js'
import Header from '../components/Header.jsx'

function TeacherDashboard() {
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [students, setStudents] = useState([])

  // statuses looks like { studentId: "present", otherStudentId: "absent" }
  const [statuses, setStatuses] = useState({})
  const [date, setDate] = useState('')

  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadMyCourses()
  }, [])

  async function loadMyCourses() {
    try {
      const data = await api.get('/teaching/my-courses')
      setCourses(data.data.courses)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  // Runs when the teacher picks a course from the dropdown
  async function chooseCourse(id) {
    setCourseId(id)
    setStudents([])
    setStatuses({})
    setRecords([])
    setError('')

    if (!id) return

    try {
      const data = await api.get('/enrollments/course/' + id + '/students')
      setStudents(data.data.students)

      // start everyone as "present" so the teacher only changes the exceptions
      const startingStatuses = {}
      data.data.students.forEach((student) => {
        startingStatuses[student._id] = 'present'
      })
      setStatuses(startingStatuses)

      const saved = await api.get('/attendance/course/' + id)
      setRecords(saved.data.attendance)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  function setStatusFor(studentId, value) {
    // copy the old object, then overwrite one key
    setStatuses({ ...statuses, [studentId]: value })
  }

  async function submitAttendance(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    // build the array the backend expects:
    // [{ studentId: "...", status: "present" }, ...]
    const attendance = students.map((student) => ({
      studentId: student._id,
      status: statuses[student._id]
    }))

    try {
      await api.post('/attendance', {
        courseId: courseId,
        date: date,
        attendance: attendance
      })

      setMessage('Attendance saved.')

      const saved = await api.get('/attendance/course/' + courseId)
      setRecords(saved.data.attendance)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  // Teacher fixing a single record afterwards
  async function changeStatus(attendanceId, newStatus) {
    setError('')
    setMessage('')

    try {
      await api.put('/attendance/' + attendanceId, { status: newStatus })

      const saved = await api.get('/attendance/course/' + courseId)
      setRecords(saved.data.attendance)
      setMessage('Record updated.')

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <Header title="Teacher Dashboard" role="teacher" />

      <div className="content">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <div className="card">
          <h3>Choose a course</h3>

          <select value={courseId} onChange={(e) => chooseCourse(e.target.value)}>
            <option value="">-- select --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.course} ({course.classType})
              </option>
            ))}
          </select>

          {courses.length === 0 && (
            <p className="empty">You are not assigned to any course yet.</p>
          )}
        </div>

        {students.length > 0 && (
          <div className="card">
            <h3>Take Attendance</h3>

            <form onSubmit={submitAttendance}>
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>
                        <select
                          value={statuses[student._id]}
                          onChange={(e) => setStatusFor(student._id, e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="submit" className="btn-main">Save attendance</button>
            </form>
          </div>
        )}

        {courseId && (
          <div className="card">
            <h3>Saved Records</h3>

            {records.length === 0 && <p className="empty">Nothing recorded yet.</p>}

            {records.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.student ? record.student.fullName : '-'}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <span className={'status ' + record.status}>{record.status}</span>
                      </td>
                      <td>
                        <select
                          value={record.status}
                          onChange={(e) => changeStatus(record._id, e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
