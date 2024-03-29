// These are database actions needed to interact with Replit DB!

const DB_URL = process.env.REPLIT_DB_URL

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      if (req.body) {
        const { key, value, action } = JSON.parse(req.body)
        
        if (action === 'GET_CHANNELS') {
          const value = await getValue(key)
          if (value) {
            res.status(200).json({ data: value })
          } else {
            res.status(404).send()
          }
        } 
        else if (action === 'DELETE_CHANNEL') { 
          const keyValue = await getValue("CHANNELS")
          if (keyValue) {
            const valArray = keyValue.split(",")
            const channelIndex = valArray.indexOf(value)

            if (channelIndex !== -1) {
              valArray.splice(channelIndex, 1)
            } else {
              res.status(404).send()
            }
            res.status(200).json({ data: valArray.join(",") })
          }
        } 
        else {
          console.log('DB IN SETKEY')
          const success = await setKey(key, value)
          if (success) {
            res.status(200).send()
          }
        }
      }   
    }
  } catch (error) {
    console.warn(error.message)
    res.status(500).send()
  }
}

// Actions
const setKey = async (key, value) => {
  try {
    const result = await fetch(DB_URL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: `${key}=${value}`
    })

    console.log("SET KEY STATUS: ", result.status)

    if (result.status === 200) {
      return true
    }
  } catch (err) {
    console.warn(err.message)
  }
}

const getValue = async key => {
  try {
    const result = await fetch(`${DB_URL}/${key}`)
    const textData = await result.text()

    if (result.status === 200) {
      return textData
    }
  } catch (err) {
    console.warn(err.message)
    return false
  }
}
