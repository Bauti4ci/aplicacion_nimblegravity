import { useState } from 'react';
import { getCandidateByEmail, getJobsList } from './api';
import JobList from './JobList';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Ingresá tu email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [candidateData, jobsData] = await Promise.all([
        getCandidateByEmail(trimmed),
        getJobsList(),
      ]);
      setCandidate(candidateData);
      setJobs(jobsData);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-bg" aria-hidden="true">
        <div className="App-bg__blob App-bg__blob--1" />
        <div className="App-bg__blob App-bg__blob--2" />
        <div className="App-bg__blob App-bg__blob--3" />
        <div className="App-bg__blob App-bg__blob--4" />
      </div>
      <div className="App-content">
        <header className="App-header App-glass">
          <h1>Postulaciones</h1>
          {candidate && jobs ? (
            <p className="App-user">
              {candidate.firstName} {candidate.lastName} ({candidate.email})
            </p>
          ) : (
            <>
              <p className="App-intro">Ingresá tu email para cargar tus datos y las posiciones disponibles.</p>
              <form onSubmit={handleLoad} className="App-form">
                <input
                  type="email"
                  className="App-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
                <button type="submit" className="App-button" disabled={loading}>
                  {loading ? 'Cargando…' : 'Cargar'}
                </button>
              </form>
              {error && <p className="App-error">{error}</p>}
            </>
          )}
        </header>
        {candidate && jobs && (
          <main className="App-main">
            <JobList jobs={jobs} candidate={candidate} />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
