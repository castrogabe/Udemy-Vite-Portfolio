// Import React hooks and helper libraries
import { useState } from 'react'; // useState lets us manage form input values
import { toast } from 'react-toastify'; // Toast notifications for user feedback
import { Helmet } from 'react-helmet-async'; // SEO-friendly dynamic page titles

// The Contact component displays a simple contact form
export default function Contact() {
  // Define local state for each form field and loading status
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent the browser’s default form refresh

    try {
      setLoading(true); // Disable button and show "Sending..." while processing

      // Send data to backend API route
      const res = await fetch('/api/messages/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, subject, message }),
      });

      // Throw error if server response isn’t OK
      if (!res.ok) throw new Error('Network response was not ok');

      // Notify success and reset form
      toast.success('Success, message sent!', { autoClose: 1000 });
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      // Show user-friendly error toast if something fails
      toast.error('Message not sent', { autoClose: 1000 });
    }

    // Re-enable the submit button
    setLoading(false);
  };

  // -------------------------------------------------------------------------
  // Render UI
  // -------------------------------------------------------------------------
  return (
    <div className='container'>
      {/* Helmet sets the document title dynamically for SEO */}
      <Helmet>
        <title>Contact Portfolio</title>
      </Helmet>

      <br />
      <h4 className='box'>Contact Portfolio</h4>

      {/* Contact form */}
      <form onSubmit={submitHandler}>
        {/* Full Name field */}
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

        {/* Email field */}
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

        {/* Subject field */}
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

        {/* Message textarea */}
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

        {/* Submit button with loading state */}
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <br />
    </div>
  );
}
