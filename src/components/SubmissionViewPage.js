import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SubmissionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const foundSubmission = storedSubmissions.find(sub => sub.id === id);
    
    if (foundSubmission) {
      setSubmission(foundSubmission);
      setFormData(foundSubmission);
    } else {
      alert('Submission not found!');
      navigate('/');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const updatedSubmissions = storedSubmissions.map(sub => sub.id === id ? formData : sub);
    localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    setSubmission(formData);
    alert('Submission updated successfully!');
  };

  const handleDelete = () => {
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || [];
    const filteredSubmissions = storedSubmissions.filter(sub => sub.id !== id);
    localStorage.setItem('submissions', JSON.stringify(filteredSubmissions));
    alert('Submission deleted successfully!');
    navigate('/');
  };

  if (!submission) return <p>Loading...</p>;

  return (
    <div>
      <h2>Submission Details</h2>
      <label>Item Found:</label>
      <input type="text" name="item" value={formData.item} onChange={handleChange} /><br />
      
      <label>Location:</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} /><br />
      
      <label>Date Found:</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} /><br />
      
      <label>Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} /><br />
      
      <label>Your Name:</label>
      <input type="text" name="finderName" value={formData.finderName} onChange={handleChange} /><br />
      
      <label>Email:</label>
      <input type="email" name="finderEmail" value={formData.finderEmail} onChange={handleChange} /><br />
      
      <label>Contact Number:</label>
      <input type="text" name="finderContact" value={formData.finderContact} onChange={handleChange} /><br />
      
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
    </div>
  );
};

export default SubmissionViewPage;
