import { useState, useEffect } from 'react'
import api from '../api.js'
import Header from '../components/Header.jsx'

function StudentDashboard() {
  const [attendance, setAttendance] = useState([])
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // which attendance row the student clicked "Request correction" on
  const [selectedId, setSelectedId] = useState('')
  const [requestedStatus, setRequestedStatus] = useState('present')
  const [reason, setReason] = useState('')

  // useEffect with an empty [] runs ONCE when the page first opens.
  useEffect(() => {
    loadEverything()
  }, [])

  async function loadEverything() {
    try {
      const a = await api.get('/attendance/my-attendance')
      setAttendance(a.data.attendance)

      const r = await api.get('/correction-requests/my-requests')
      setRequests(r.data.correctionRequests)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  async function submitRequest(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await api.post('/correction-requests', {
        attendanceId: selectedId,
        requestedStatus: requestedStatus,
        reason: reason
      })

      setMessage('Correction request sent to the admin.')
      setSelectedId('')
      setReason('')
      loadEverything()

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <Header title="Student Dashboard" role="student" />

      <div className="content">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <div className="card">
          <h3>My Attendance</h3>

          {attendance.length === 0 && <p className="empty">No attendance recorded yet.</p>}

          {attendance.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Recorded by</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.course ? record.course.course : '-'}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={'status ' + record.status}>{record.status}</span>
                    </td>
                    <td>{record.recordedBy ? record.recordedBy.fullName : '-'}</td>
                    <td>
                      <button
                        className="btn-small"
                        onClick={() => setSelectedId(record._id)}
                      >
                        Request correction
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* This form only appears after a row is selected */}
        {selectedId && (
          <div className="card">
            <h3>Request a Correction</h3>

            <form onSubmit={submitRequest}>
              <div className="field">
                <label>What should the status be?</label>
                <select
                  value={requestedStatus}
                  onChange={(e) => setRequestedStatus(e.target.value)}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div className="field">
                <label>Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-main">Send request</button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedId('')}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <h3>My Correction Requests</h3>

          {requests.length === 0 && <p className="empty">You have not sent any requests.</p>}

          {requests.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Asked for</th>
                  <th>Reason</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      {request.attendance && request.attendance.course
                        ? request.attendance.course.course
                        : '-'}
                    </td>
                    <td>{request.requestedStatus}</td>
                    <td>{request.reason}</td>
                    <td>
                      <span className={'status ' + request.status}>{request.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
