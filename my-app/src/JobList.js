import { useState } from 'react';
import { submitApplication } from './api';
import './JobList.css';

/**
 * Listado de posiciones (Step 4): título, input URL repo, botón Submit.
 */
function JobList({ jobs, candidate }) {
  const [repoUrls, setRepoUrls] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [message, setMessage] = useState({});

  const handleRepoChange = (jobId, value) => {
    setRepoUrls((prev) => ({ ...prev, [jobId]: value }));
    setMessage((prev) => ({ ...prev, [jobId]: null }));
  };

  const handleSubmit = async (job) => {
    const url = (repoUrls[job.id] || '').trim();
    if (!url) {
      setMessage((prev) => ({ ...prev, [job.id]: 'Ingresá la URL de tu repositorio.' }));
      return;
    }
    setSubmitting((prev) => ({ ...prev, [job.id]: true }));
    setMessage((prev) => ({ ...prev, [job.id]: null }));
    try {
      await submitApplication({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        repoUrl: url,
      });
      setMessage((prev) => ({ ...prev, [job.id]: 'Postulación enviada correctamente.' }));
    } catch (err) {
      setMessage((prev) => ({
        ...prev,
        [job.id]: err.message || 'Error al enviar la postulación.',
      }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [job.id]: false }));
    }
  };

  return (
    <section className="job-list">
      <h2>Posiciones abiertas</h2>
      <ul className="job-list__items">
        {jobs.map((job) => (
          <li key={job.id} className="job-list__item">
            <h3 className="job-list__title">{job.title}</h3>
            <div className="job-list__row">
              <input
                type="url"
                className="job-list__input"
                placeholder="https://github.com/tu-usuario/tu-repo"
                value={repoUrls[job.id] || ''}
                onChange={(e) => handleRepoChange(job.id, e.target.value)}
                disabled={submitting[job.id]}
              />
              <button
                type="button"
                className="job-list__submit"
                onClick={() => handleSubmit(job)}
                disabled={submitting[job.id]}
              >
                {submitting[job.id] ? 'Enviando…' : 'Submit'}
              </button>
            </div>
            {message[job.id] && (
              <p className={`job-list__message job-list__message--${message[job.id].includes('correctamente') ? 'success' : 'error'}`}>
                {message[job.id]}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default JobList;
