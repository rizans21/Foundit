import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormPage.css';
import LegalModal from './legal/LegalModal';
import TermsContent from './legal/TermsContent';
import PrivacyContent from './legal/PrivacyContent';
// Path is relative to FormPage.js

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Page 1 fields
    item: '',
    location: '',
    date: '',
    description: '',
    image: null,
    // Page 2 fields
    name: '',
    email: '',
    phone: '',
    acceptTerms: false
  });

  const [step, setStep] = useState(1); // 1: Item details, 2: Contact info, 3: Review
  const [errors, setErrors] = useState({});
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    submissionId: null
  });
  const [activeModal, setActiveModal] = useState(null);

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    
    // Special handling for file inputs
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors({...errors, image: 'Only image files are allowed'});
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, image: 'File size must be less than 5MB'});
        return;
      }
    }

    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.item) {
        newErrors.item = 'This field is required';
        isValid = false;
      }
      if (!formData.location) {
        newErrors.location = 'This field is required';
        isValid = false;
      }
      if (!formData.date) {
        newErrors.date = 'This field is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.name) {
        newErrors.name = 'This field is required';
        isValid = false;
      }
      if (!formData.email) {
        newErrors.email = 'This field is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
      if (!formData.phone) {
        newErrors.phone = 'This field is required';
        isValid = false;
      } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    setErrors({}); // Clear previous errors
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setErrors({}); // Clear errors when going back
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      setErrors({...errors, acceptTerms: 'You must accept the terms'});
      return;
    }

    setSubmissionState({
      ...submissionState,
      isSubmitting: true,
      isError: false
    });

    try {
      // Send form data to the backend for storing
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: formData.item,        // Dynamic form data values
          location: formData.location,
          description: formData.description,
          image: formData.image ? formData.image.name : null, // If an image is selected, send its name
        }),
      });

      const result = await response.json(); // Ensure this is awaited before accessing its properties

      if (!response.ok) {
        throw new Error('Submission failed. Please try again.');
      }

      console.log('Form submitted successfully:', result);

      setSubmissionState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        submissionId: result.submissionId // Assuming the backend returns the submissionId
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: error.message || 'Submission failed. Please try again.'
      });
    }
  };

  const viewSubmission = () => {
    navigate(`/submissions/${submissionState.submissionId}`);
  };

  const retrySubmission = () => {
    setSubmissionState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    });
    setStep(3); // Return to review page
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-container">
        {/* STEP 1: Item Details */}
        {step === 1 && !submissionState.isSuccess && (
          <div id="form-section">
            <h2>Lost & Found Property Report Form</h2>
            <p className="subtitle">Please take a time to detail it as accurately as possible.</p>
            
            <form id="found-item-form">
              <div className="form-group">
                <label htmlFor="item">What did you find? <span className="required">*</span></label>
                <input
                  type="text"
                  id="item"
                  value={formData.item}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.item}
                  aria-describedby={errors.item ? "item-error" : undefined}
                />
                {errors.item && <div id="item-error" className="error-message">{errors.item}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="location">Where did you find it? <span className="required">*</span></label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? "location-error" : undefined}
                />
                {errors.location && <div id="location-error" className="error-message">{errors.location}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="date">When did you find it? <span className="required">*</span></label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  min="2000-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  aria-required="true"
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
                {errors.date && <div id="date-error" className="error-message">{errors.date}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="description">How was it found?</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  aria-describedby="description-help"
                />
                <p id="description-help" className="help-text">Optional: Describe the circumstances of finding the item</p>
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  id="image"
                  onChange={handleChange}
                  accept="image/*"
                  aria-describedby={errors.image ? "image-error" : "image-help"}
                />
                {errors.image ? (
                  <div id="image-error" className="error-message">{errors.image}</div>
                ) : (
                  <p id="image-help" className="help-text">Optional: Upload a clear photo of the item (max 5MB)</p>
                )}
              </div>

              <div className="btn-container single">
                <button type="button" onClick={nextStep}>
                  Next: Contact Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Contact Information */}
        {step === 2 && !submissionState.isSuccess && (
          <div id="contact-section">
            <h2>Your Contact Details</h2>
            <p className="subtitle">Please provide your contact information</p>

            <form id="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <div id="name-error" className="error-message">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <div id="email-error" className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && <div id="phone-error" className="error-message">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="acceptTerms">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.acceptTerms}
                  />
                  I accept the <button type="button" onClick={() => setActiveModal('terms')}>terms</button> and <button type="button" onClick={() => setActiveModal('privacy')}>privacy policy</button>.
                </label>
                {errors.acceptTerms && <div id="acceptTerms-error" className="error-message">{errors.acceptTerms}</div>}
              </div>

              <div className="btn-container">
                <button type="button" onClick={prevStep}>Back: Item Details</button>
                <button type="button" onClick={nextStep}>Next: Review</button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && !submissionState.isSuccess && (
          <div id="review-section">
            <h2>Review & Submit</h2>
            <p className="subtitle">Please review your information before submitting.</p>
            <div className="review-container">
              <p><strong>Item:</strong> {formData.item}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              {formData.image && <p><strong>Image:</strong> {formData.image.name}</p>}
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>

              <div className="btn-container">
                <button type="button" onClick={prevStep}>Back: Contact Details</button>
                <button type="button" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error states */}
        {submissionState.isSuccess && (
          <div className="submission-result success">
            <h2>Submission Successful!</h2>
            <p>Your item has been successfully submitted. You can view it here:</p>
            <div className="btn-container">
              <button onClick={viewSubmission}>View Submission</button>
            </div>
          </div>
        )}
        {submissionState.isError && (
          <div className="submission-result error">
            <h2>Error</h2>
            <p>{submissionState.errorMessage}</p>
            <div className="btn-container">
              <button onClick={retrySubmission}>Retry</button>
            </div>
          </div>
        )}
      </div>
      
      {activeModal === 'terms' && (
        <LegalModal
          content={<TermsContent />}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'privacy' && (
        <LegalModal
          content={<PrivacyContent />}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default FormPage;
