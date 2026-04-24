import { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async'; // use react-helmet-async

export default function Contact() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/messages/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, subject, message }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      toast.success('Success, message sent!', { autoClose: 1000 });
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error('Message not sent', { autoClose: 1000 });
    }
    setLoading(false);
  };

  return (
    <div className='container'>
      <Helmet>
        <title>Contact Portfolio</title>
      </Helmet>

      <br />
      <h4 className='box'>Contact Portfolio</h4>

      <form onSubmit={submitHandler}>
        {/* Full Name */}
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Full Name
          </label>
          <input
            type='text'
            id='name'
            className='form-control'
            placeholder='full name'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='form-control'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Subject */}
        <div className='mb-3'>
          <label htmlFor='subject' className='form-label'>
            Subject / Project Description
          </label>
          <input
            type='text'
            id='subject'
            className='form-control'
            placeholder='ex: Landing Page or Full Stack?'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {/* Message */}
        <div className='mb-3'>
          <label htmlFor='message' className='form-label'>
            Message
          </label>
          <textarea
            id='message'
            className='form-control'
            rows='4'
            placeholder='your message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
      <br />
    </div>
  );
}

// If you want to review the commented teaching version of the Contact.jsx setup, check commit lesson-04.
