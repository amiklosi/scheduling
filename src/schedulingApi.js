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

  const getAvailability = (from, to) => {
    let begin = from.format('YYYY-MM-DD')
    let end = to.format('YYYY-MM-DD[T23:59]')
    console.log('getting avail', begin, end)
    return fetch(`${serviceUrl}/get-availability/${userId}?begin=${begin}&end=${end}`).then(r => r.json())
  }

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
    getAvailability,
    getAllAvailability,
    addNewAvailability,
    updateAvailability,
    deleteAvailability
  }
}
