// components/legal/TermsContent.jsx
const TermsContent = () => (
  <div className="legal-content">
    <h3>Terms and Conditions</h3>
    <p>Last Updated: {new Date().toLocaleDateString()}</p>
    {/* Your actual terms text here */}
    <section>
      <h4>1. Acceptance of Terms</h4>
      <p>By using our service...</p>
    </section>
  </div>
);
export default TermsContent;