const express = require('express')
const app = express()
const path = require('path');
// const port = 3002
const port = process.env.PORT || 3002;

const request = require('request');
// const port = process.env.PORT || 3002;
//

const puppeteer = require('puppeteer');


app.use(express.static(path.join(__dirname + '/client/build')));



app.get('/hello', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




async function asyncCall()  {
        // const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
            args: ['--user-agent=<user_agent_string>'],
            });


        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 926 });
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
        await page.goto('https://www.costco.com/CatalogSearch?dept=All&keyword=Toilet+paper');

    let hotelData = await page.evaluate(() => {
      let hotels = [];
      // get the hotel elements
      let hotelsElms = document.querySelectorAll('div.product div.product-tile-set');
      // get the hotel data
      let count = 0
      hotelsElms.forEach((hotelelement) => {
          let hotelJson = {};
          try {
            
            hotelJson.name = hotelelement.querySelector("img.img-responsive").getAttribute(['alt']);
            hotelJson.quantity = hotelelement.querySelector("input[name='in_Stock']").getAttribute(['value']);

          // hotelJson.status = hotelelement.querySelector("img.product-out-stock-overlay").getAttribute(['title']);

          try {
            hotelJson.status = hotelelement.querySelector("img.product-out-stock-overlay").getAttribute(['title'])

          }catch (exception){
            hotelJson.status = 'Unknown'

          }
            hotelJson.Method = "Regular"
            hotelJson.Buy = "No"  
            hotelJson.Method = hotelelement.querySelector("img.hom-bad2").getAttribute(['alt'])

            if (hotelelement.querySelector("input[name='in_Stock']").getAttribute(['value']) > 0 && hotelJson.Method == "Regular"){
              hotelJson.Buy = "Yes" 
              count = count + 1

            } 

            
          }
          catch (exception){

          }
          hotels.push(hotelJson);
      });
      // return hotels;
      return [hotels,count];
  });

  current_time = (Date()).toString();
  console.log(current_time)
  console.dir(JSON.stringify(hotelData[0]));
  console.dir(hotelData[0].length)
  console.log(hotelData[1])

  if (hotelData[1] > 0){
    send_mail()
  }

  app.post('/getdata', function (req, res){
    console.log('getting data!');
    res.send(JSON.stringify(hotelData[0]))
  })
  app.post('/gettime', function (req, res){
    console.log('getting time!');
    res.send(current_time)
  })
  


//// working part end
        
        // const myLocalValue = '12345';
        // // await page.$eval('input[name=CN1]', (el, value) => el.value = value, myLocalValue);
        // await page.type('input[name=CN1]', 'ssss', {delay: 20})
        await page.screenshot({path: 'sccse.png'});
        await browser.close();
      
      };

      asyncCall()
      var minutes = 30, the_interval = minutes * 60 * 1000;
      setInterval(function() {
        asyncCall()
      }, the_interval);

      
      function send_mail() {

        const nodemailer = require('nodemailer');

      let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'Harcostp4@gmail.com', 
          pass: '********'           
      }
      });

      let mailOptions = {
      from: 'Harcostp4@gmail.com',
      to: 'harrisiqbal64@gmail.com',
      subject: 'There is TP!',
      text: 'Go Now!!'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error.message);
        }
      console.log('success');
      });
}
