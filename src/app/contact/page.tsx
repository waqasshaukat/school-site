'use client';

import { useState } from 'react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., send data to a server.
    // For this prototype, we'll just simulate it.
    setSubmitted(true);
  };

  return (
    <div className="py-5">
      <h1>Contact Us</h1>
      <p>
        We would love to hear from you! Please feel free to contact us with any questions or concerns.
      </p>
      <div className="row">
        <div className="col-md-6">
          <h2>Our Address</h2>
          <p>
            123 Main Street
            <br />
            Springfield, USA 12345
          </p>
          <h2>Phone</h2>
          <p>(123) 456-7890</p>
          <h2>Email</h2>
          <p>info@springfieldelementary.com</p>
        </div>
        <div className="col-md-6">
          <h2>Send us a message</h2>
          {submitted ? (
            <div className="alert alert-success" role="alert">
              Thank you for your message! We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;