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

  const getAvailability = ({userId: maybeUserId, begin, end}) => {
    let b = begin.format('YYYY-MM-DD')
    let e = end.format('YYYY-MM-DD[T23:59]')
    const uid = maybeUserId || userId
    return fetch(`${serviceUrl}/get-availability/${uid}?begin=${b}&end=${e}`).then(r => r.json())
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

  const bookSession = (user1Id, user2Id, begin, end) => {
    console.log('booking session', user1Id, user2Id, begin, end)
    return handleFetchError(fetch(`${serviceUrl}/book-session`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          begin: begin,
          end: end,
          user1: user1Id,
          user2: user2Id
        })
      })
    )
  }

  return {
    bookSession,
    getAvailability,
    getAllAvailability,
    addNewAvailability,
    updateAvailability,
    deleteAvailability
  }
}
