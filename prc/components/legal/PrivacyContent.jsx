// components/legal/PrivacyContent.jsx
const PrivacyContent = () => (
  <div className="legal-content">
    <h3>Data Privacy Policies</h3>
    <p>Last Updated: {new Date().toLocaleDateString()}</p>
    {/* Your actual privacy Policies text here */}
    <section>
      <h4>1. Acceptance of Data Privacy Policies</h4>
      <p>By using our service...</p>
    </section>
  </div>
);
export default PrivacyContent;