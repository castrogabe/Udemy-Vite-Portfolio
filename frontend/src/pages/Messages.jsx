import { useEffect, useContext, useState, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox.jsx';
import MessageBox from '../components/MessageBox.jsx';
import { getError } from '../utils';
import AdminPagination from '../components/AdminPagination.jsx'; // ensure filename matches

// ---- helpers ----
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON or empty body is fine
  }
  if (!res.ok) {
    const msg = body?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

// ---- reducer ----
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        messages: action.payload.messages || [],
        totalMessages: action.payload.totalMessages ?? 0,
        page: action.payload.page ?? 1,
        pages: action.payload.pages ?? 1,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function Messages() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = Number(sp.get('page') || 1);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    {
      loading,
      error,
      loadingDelete,
      successDelete,
      totalMessages,
      pages,
      messages = [],
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    messages: [],
    totalMessages: 0,
    pages: 1,
  });

  const [replyVisible, setReplyVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    replyContent: '',
  });

  const sendReply = async (e) => {
    e.preventDefault();
    try {
      await fetchJSON('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          email: replyMessage.email,
          subject: replyMessage.subject,
          replyContent: replyMessage.replyContent,
        }),
      });
      setReplyVisible(false);
      toast.success('Reply sent successfully', { autoClose: 1000 });
    } catch (err) {
      toast.error(getError(err), { autoClose: 1500 });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const data = await fetchJSON(`/api/messages/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (messageToDelete) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await fetchJSON(`/api/messages/${messageToDelete._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('Message deleted successfully', { autoClose: 1500 });
      dispatch({ type: 'DELETE_SUCCESS' });
      // Optimistic local update
      // (or let the effect re-fetch after successDelete flips)
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELETE_FAIL' });
    }
  };

  // MM-DD-YYYY
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <div className='content'>
        <br />
        <h4 className='box'>
          Messages ({totalMessages !== undefined ? totalMessages : 'Loading...'}
          )
        </h4>

        <div className='box'>
          {loadingDelete && <LoadingBox />}

          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <div className='table-responsive'>
              <table className='table table-striped table-bordered align-middle noWrap'>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>SUBJECT</th>
                    <th>MESSAGE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id}>
                      <td>{formatDate(message.createdAt)}</td>
                      <td>{message.fullName}</td>
                      <td>{message.email}</td>
                      <td>{message.subject}</td>
                      <td style={{ minWidth: 280 }}>
                        <textarea
                          className='form-control'
                          rows={3}
                          value={message.message}
                          readOnly
                        />
                      </td>
                      <td className='text-nowrap'>
                        <button
                          type='button'
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            setReplyMessage({
                              fullName: message.fullName,
                              email: message.email,
                              subject: `Re: ${message.subject}`,
                              message: message.message,
                              replyContent: '',
                            });
                            setReplyVisible(true);
                          }}
                        >
                          Reply
                        </button>{' '}
                        <button
                          type='button'
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(message)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reply Form */}
        {replyVisible && (
          <div className='box'>
            <h2>Reply Email to: {replyMessage.fullName}</h2>
            <form onSubmit={sendReply}>
              <div className='mb-2'>
                <label className='form-label'>
                  Email: <strong>{replyMessage.email}</strong>
                </label>
                <div className='form-text'>
                  Subject: <em>{replyMessage.subject}</em>
                </div>
              </div>

              <div className='mb-3'>
                <label htmlFor='replyContent' className='form-label'>
                  Message
                </label>
                <textarea
                  id='replyContent'
                  className='form-control'
                  rows={5}
                  value={replyMessage.replyContent}
                  onChange={(e) =>
                    setReplyMessage((prev) => ({
                      ...prev,
                      replyContent: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button type='submit' className='btn btn-primary me-2'>
                Send Reply
              </button>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={() => setReplyVisible(false)}
              >
                Close
              </button>
            </form>
          </div>
        )}

        <AdminPagination
          currentPage={page}
          totalPages={pages}
          isAdmin={true}
          keyword='Messages'
        />
        <br />
      </div>
    </>
  );
}

// If you want to review the commented teaching version of the Messages.jsx setup, check commit lesson-06.
