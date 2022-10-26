// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the cheerio object into a variable, `content`
// which holds data and metadata about the html file (written as txt)
var content = fs.readFileSync('data/m01.txt');

// load `content` into a cheerio object - $ there's data in here in which I can make selections
var $ = cheerio.load(content);

var meetings = [];

$('tr').each(function(i, elem) {
    if ($(elem).attr("style")=="margin-bottom:10px") {
        // console.log($(elem).html());
        // console.log('*************')
        // var thisMeeting = {}; // Your function and data collection go here! 
        let row = $(elem).html()
        parseData(row)
    }
});

function parseData(tr) {
  
// address and location parsing
  let locationFinal = tr.split('<h4 style="margin:0;padding:0;">')[1].split('</h4><br>')[0]
  let addressFinal = tr.split('</b><br>\n' +
      '\t\t\t\t\t\t')[1].split(', \n')[0].split(',')[0]
  //  let stateFinal = tr.split('</b><br>\n' +
//       '\t\t\t\t\t\t')[1]
  // let zipFinal = tr.split('</b><br>\n' +
  //     '\t\t\t\t\t\t')[1]
  // let zipFinal = tr.split('<br>')
  let additionalAddressInfo = tr.split('\t\t\t\t\t\t')[2].replace('<br>','').replace('\n','')
  let zipArray = additionalAddressInfo.match(/\d{5}/)
  let zip
  if(zipArray === null) {
    zip = 'N/A'
  } else {
    zip = zipArray[0]
  }
  let meetingDay = tr.split('\t\t\t\t  \t    <b>').slice(2)
  
// meeting day and time parsing
  meetingDay.forEach(function(item,index) {
    const startDays = item.split('From</b>')
    const finalDays = startDays[0]
    const restDays = startDays[1]
    const start = restDays.split('<b>to</b>')
    const finalStart = start[0]
    const restStart = start[1]
    const end = restStart.split('<br><b>Meeting Type</b>')
    const finalEnd = end[0]
    const restEnd = end[1]
    const meetingType = restEnd.split('<br><b>')
    const finalType = meetingType[0].split('\t\t\t')[0]
    
    meetings.push({
      location: locationFinal,
      address: addressFinal,
    //   state: stateFinal,
      zip: zip,
      additionalAddressInfo: additionalAddressInfo,
      day: finalDays.trim(),
      startTime: finalStart.trim(),
      endTime: finalEnd.trim(), 
      meetingType: finalType.replace('Meeting Type</b>','').replace(' \n','').trim()
    })
  });
  
  return meetings
//   console.log(meetings)
}

console.log(meetings)
