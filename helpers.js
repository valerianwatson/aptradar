const cheerio = require('cheerio');
const moment = require('moment');

function extractListingsFromHTML_1 (html) {
  const $ = cheerio.load(html);
  // const vacancyRows = $('.view-Vacancies tbody tr');
  const vacancyRows = $('.tile');
  const apts = [];
 /*  const head = $('.size').text();    //teste ob es überhaupt geht
  console.log("the head: ", head); */
  vacancyRows.each((i, el) => {
    // Extract information from each row of the jobs table
    // let closing = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    //let  = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    let size = $(el).find('.size').children().last().text().trim();
    let rooms = $(el).find('.rooms').children().last().text().trim();
    let price = $(el).find('.price').children().last().text().trim();
    let district = "";
    let address  = "";
    let balcony;
    
  
    
    //let location = $(el).children('.views-field-name').text().trim();
    //closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

   // apts.push({closing, job, location});
    apts.push({size, rooms, price, district, address, balcony});
  

  });
 
  console.log("HALLO BIN AUCH DA");
  return apts;
}

module.exports = {
  extractListingsFromHTML_1
};