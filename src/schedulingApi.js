const SERVICE_URL = 'http://localhost:5002/smashcut-a23d2/us-central1/schedule'

const handleFetchError = (promise) => new Promise((resolve, reject) => {
  promise
    .then(result => result.json())
    .then(result => {
      if (result.error) {
        reject(result.error)
      }
      resolve(result)
    })
    .catch(reject)
})

export const schedulingApi = (userId) => {
  const getAllAvailability = () => {
    return fetch(`${SERVICE_URL}/get-all-availability/${userId}`).then(r => r.json())
  }
  const addNewAvailability = (begin, end, availability, isBlocked) =>
    handleFetchError(fetch(`${SERVICE_URL}/add-availability/${userId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          begin: begin,
          end: end,
          availability,
          isBlocked
        })
      })
    )
  const updateAvailability = (id, begin, end, availability) =>
    handleFetchError(fetch(`${SERVICE_URL}/update-availability/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          begin: begin,
          end: end,
          availability
        })
      })
    )
  const deleteAvailability = (id) =>
    handleFetchError(fetch(`${SERVICE_URL}/delete-availability/${id}`,
      {
        method: "DELETE",
      })
    )
  return {
    getAllAvailability,
    addNewAvailability,
    updateAvailability,
    deleteAvailability
  }
}
