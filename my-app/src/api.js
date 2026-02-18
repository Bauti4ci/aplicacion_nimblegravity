const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

/**
 * Obtiene los datos del candidato por email (Step 2).
 * @param {string} email
 * @returns {Promise<{ uuid: string, candidateId: string, applicationId: string, firstName: string, lastName: string, email: string }>}
 */
export async function getCandidateByEmail(email) {
  const res = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
  );
  if (!res.ok) throw new Error('No se pudo obtener el candidato');
  return res.json();
}

/**
 * Obtiene la lista de posiciones abiertas (Step 3).
 * @returns {Promise<Array<{ id: string, title: string }>>}
 */
export async function getJobsList() {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);
  if (!res.ok) throw new Error('No se pudo obtener la lista de trabajos');
  return res.json();
}

/**
 * Envía la postulación a una posición (repo URL requerida para Step 5).
 * Ajusta el endpoint según la documentación del backend si es distinto.
 */
export async function submitApplication({ jobId, candidateId, applicationId, repositoryUrl }) {
  const res = await fetch(`${BASE_URL}/api/application/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId,
      candidateId,
      applicationId,
      repositoryUrl,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al enviar la postulación');
  }
  return res.json().catch(() => ({}));
}
