const puppeteer = require('puppeteer');

let bookingUrl = 'insert booking URL';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();



@@ -24,77 +24,44 @@ async function asyncCall()  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    // await page.goto('https://www.costco.com');
    await page.goto('https://www.costco.com/CatalogSearch?dept=All&keyword=toilet+paper');
    // await Promise.all([
    //     page.waitForNavigation(),
    //     page.click('#surveyQuestions > p:nth-child(2) > a')
    // ]);

  //   const result = await page.evaluate(() => {
  //       let res_all = document.querySelectorAll('img.img-responsive')
  //       let res=[]
  //       res_all.forEach((each_one) => {
  //           res.push(each_one.getAttribute(['alt']))
  //       })

  //       // let res=[]
  //       // res_all_stock.forEach((each_one) => {
  //       //     res.push(each_one.getAttribute(['value']))
  //       // })

  //    return {
  //       res
  //       // res_all_stock
  //      }
  //  })
  //   console.log(result)


//     const result = await page.evaluate(() => {
//       let res_all_stock = document.querySelectorAll("div.product")
//       let res=[]
//       res_all.forEach((each_one) => {
//           res.push(each_one.getAttribute(['alt']))
//       })

//       // let res=[]
//       // res_all_stock.forEach((each_one) => {
//       //   let hotelJson = {};
//       //     hotelJson.name = each_one.querySelector("div.product-tile-set ").innerText
//       //     // let test_1 = each_one.querySelector("div.product-tile-set")



//       //     // res.push(each_one.innerHTML)
//       // })
//           res.push(hotelJson)


//    return 
//       res
//       // res_all_stock
//  })
//   console.log(JSON.stringify(result))


    await page.goto('https://www.costco.com/CatalogSearch?dept=All&keyword=Toilet+paper');

//// working part start

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
          // hotelJson.me = hotelelement.querySelector("img.hom-bad2").getAttribute(['alt'])
                         

@ -109,16 +76,20 @@ async function asyncCall()  {
      }
      hotels.push(hotelJson);
  });
  return hotels;
  return [hotels,count];
});

current_time = (Date()).toString();
console.log(current_time)
console.dir(JSON.stringify(hotelData));
console.dir(hotelData.length)
console.dir(JSON.stringify(hotelData[0]));
console.dir(hotelData[0].length)
console.log(hotelData[1])
if (hotelData[1] > 0){
send_mail()
}

app.post('/getdata', function (req, res){
res.send(JSON.stringify(hotelData))
res.send(JSON.stringify(hotelData[0]))
})
app.post('/gettime', function (req, res){
res.send(current_time)
@ -143,3 +114,32 @@ async function asyncCall()  {
  }, the_interval);

  
  function send_mail() {

            const nodemailer = require('nodemailer');

          let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
              user: 'Harcostp4@gmail.com', // like : abc@gmail.com
              pass: 'Retro_flower16!'           // like : pass@123
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