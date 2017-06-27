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

export const schedulingApi = (serviceUrl, userId) => {
  const getAllAvailability = () => {
    return fetch(`${serviceUrl}/get-all-availability/${userId}`).then(r => r.json())
  }
  const addNewAvailability = (begin, end, availability, isBlocked) =>
    handleFetchError(fetch(`${serviceUrl}/add-availability/${userId}`,
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
    handleFetchError(fetch(`${serviceUrl}/update-availability/${id}`,
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
    handleFetchError(fetch(`${serviceUrl}/delete-availability/${id}`,
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
