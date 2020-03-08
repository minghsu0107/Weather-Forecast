const request = require('request')

const geocode = (address) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoibWluZ2hzdTAxMDciLCJhIjoiY2s3aXJmZGh1MG80eTNzcWw1NmF0dXE2NyJ9.qf09lnh3jyQX6l28MhbD5A'

    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body }) => {
            if (error) {
                reject(new Error('Unable to connect to location services!'))
            } else if (body.features.length === 0) {
                reject(new Error('Unable to find location. Try another search.'))
            } else {
                resolve({
                    latitude: body.features[0].center[1],
                    longitude: body.features[0].center[0],
                    location: body.features[0].place_name
                })
            }
        }) 
    })
}



module.exports = geocode



