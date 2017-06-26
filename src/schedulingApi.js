const SERVICE_URL = 'http://localhost:5002/smashcut-a23d2/us-central1/schedule'

export const getAllAvailability = (userId) => {
  return fetch(`${SERVICE_URL}/get-all-availability/${userId}`).then(r => r.json())
}
