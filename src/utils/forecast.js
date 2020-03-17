const request = require('request')

const forecast = (latitude, longitude, location) => {
    const url = 'https://api.darksky.net/forecast/73e5e80ba561808692606c2f1e63bd94/' + latitude + ',' + longitude

    return new Promise((resolve, reject) => {
        request({ url, json: true }, (error, { body }) => {
            if (error) {
                reject(new Error('Unable to connect to weather service!'))
            } else if (body.error) {
                reject(new Error('Unable to find location'))
            } else {
                resolve({
                    forecastData: body.daily.data[0].summary + ' It is currently ' + 
                        (5 * (body.currently.temperature - 32) / 9).toFixed(2) + '°C. There is a ' + 
                        (Number(body.currently.precipProbability) * 100).toFixed(2) + '% chance of rain.',
                    location: location
                })
            }
        }) 
    })
}


module.exports = forecast
