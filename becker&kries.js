//https://beckerundkries-mietangebote.immomio.de/immobilien-ort/berlin/?post_type=immomakler_object&paged=1&nutzungsart=wohnen&typ=wohnung&ort=berlin&center=&radius=5&objekt-id=&collapse=in&von-qm=0.00&bis-qm=1000.00&von-zimmer=0.00&bis-zimmer=8.00&von-kaltmiete=0.00&bis-kaltmiete=10000.00&von-kaufpreis=0.00&bis-kaufpreis=25000.00
const cheerio = require('cheerio');
const moment = require('moment');

function extractListingsFromHTML_3 (html) {
  const $ = cheerio.load(html);
  // const vacancyRows = $('.view-Vacancies tbody tr');
  const vacancyRows = $('.property-container');
  const apts = [];
 /*  const head = $('.size').text();    //teste ob es überhaupt geht
  console.log("the head: ", head); */
  vacancyRows.each((i, el) => {
    // Extract information from each row of the jobs table
    // let closing = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    //let  = $(el).children('.views-field-field-vacancy-deadline').first().text().trim();
    let size = $(el).find('.property-data').children('div:nth-of-type(3)').children().last().text().trim();
    let rooms = $(el).find('.property-data').children('div:nth-of-type(2)').children().last().text().trim();
    let price = $(el).find('.property-data').children().last().children().last().text().trim();
    let district = " ";
    let address  = $(el).find('.property-subtitle').text().trim();
    let link =  $(el).children().children().first().attr('href');
    let balcony = ' ';
    let source = 'Becker&Kries';
    let image = $(el).find('img').attr('src');
    let created = '';
    let description = $(el).find('.property-title').children().text().trim();
    
  
    
    //let location = $(el).children('.views-field-name').text().trim();
    //closing = moment(closing.slice(0, closing.indexOf('-') - 1), 'DD/MM/YYYY').toISOString();

   // apts.push({closing, job, location});
    //apts.push({size, rooms, price, district, address,});
    apts.push({size, rooms, price, balcony, district, address,link, source, description, image});

  });
 
  console.log("HALLO BIN AUCH DA");
  return apts;
}

module.exports = {
  extractListingsFromHTML_3
};