import React, { useState } from 'react';
import axios from 'axios';

const FormPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [image, setImage] = useState(null);
  const [applicationLink, setApplicationLink] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('salary', salary);
    formData.append('image', image);
    formData.append('applicationLink', applicationLink);
    formData.append('location', location);

    try {
      const response = await axios.post('http://localhost:5050/api/offcampussubmit-form', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Form submitted successfully!');
    } catch (error) {
      setMessage('Error submitting the form.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Submit Job Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salary</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>
     
        <div>
          <label>Application Link</label>
          <input
            type="url"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
             <div>
          <label>Job Poster</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FormPage;
