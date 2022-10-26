"use strict"

// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    axios = require('axios'),
    async = require('async'),
        dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.API_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = ["20 Cardinal Hayes Place","283 W. Broadway","22 Barclay Street","49 Fulton Street", "125 Barclay Street"];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };
    
    const addressGeocodes = {
        address: "",
        latLong:{}
    }

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
        try {
            // 		const response = await got(apiRequest);
            console.log(apiRequest)

            // 		const response = await axios.get(apiRequest);

            axios.get(apiRequest)
                .then(function(response) {
                    // handle success and get geocode output
                    const geocode = response.data.OutputGeocodes[0].OutputGeocode
                    // console.log(response.data.OutputGeocodes)
                    console.log(geocode)
                    
                    addressGeocodes.address = value
                    addressGeocodes.latLong.lat = geocode.Latitude
                    addressGeocodes.latLong.long = geocode.Longitude
                    
                    // console.log(response.data)
                    // push address and geocodes to array
                    meetingsData.push(addressGeocodes);
                    console.log(meetingsData)

                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });

        }
        catch (error) {
            console.log(error.response);
        }
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
