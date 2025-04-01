import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FormPage from './components/FormPage';
import ViewItem from './components/ViewItem';
import SearchResults from './components/SearchResults';
import SubmissionViewPage from './components/SubmissionViewPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/submissions/:id" element={<SubmissionViewPage />} />
        <Route path="/view-item/:itemName" element={<ViewItem />} />
        <Route path="/results/:searchQuery" element={<SearchResults />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
