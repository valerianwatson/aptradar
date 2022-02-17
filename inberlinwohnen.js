const cheerio = require('cheerio');
const moment = require('moment');

function extractListingsFromHTML_2 (html) {
  const $ = cheerio.load(html);
  const vacancyRows = $('.tb-merkflat');
  const apts = [];
 /*  const head = $('.size').text();    //teste ob es überhaupt geht
  console.log("the head: ", head); */
  vacancyRows.each((i, el) => {
    // Extract information from each row of the jobs table
    // let closing = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    //let  = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    let size = $(el).find('._tb_left strong:nth-child(2)').text().trim();
    let rooms = $(el).find('._tb_left').children().first().text().trim();
    let price = $(el).find('._tb_left').children().last().text().trim();
    let district = $(el).find('._tb_left').text().split(" ").pop();
    let address = $(el).find('._tb_left').text().split(" | ").pop();
    let balcony;
    
  
    
    //let location = $(el).children('.views-field-name').text().trim();
    //closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

   // apts.push({closing, job, location});
    apts.push({size, rooms, price, district, address, balcony});
   

  });
 
  //console.log('the size is:', size);
  return apts;
}

module.exports = {
  extractListingsFromHTML_2
};