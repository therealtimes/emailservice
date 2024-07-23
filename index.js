const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const password = process.env.YAHOO_PASSWORD;


(async () => {
  // Take a screenshot
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.therealtimes.org');
  await page.screenshot({ path: 'screenshot.png', fullPage: false });
  await browser.close();

  // Read the screenshot file
  const screenshot = fs.readFileSync('screenshot.png');

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'jili.jiang@yahoo.com',
      pass: password,
    }
  });

  // Define email options
  const mailOptions = {
    from: 'jili.jiang@yahoo.com',
    to: 'josephbillings@gmail.com',
    subject: 'Check out our latest update!',
    html: `
      <p>Hello,</p>
      <p>Check out our latest update on the website:</p>
      <a href="https://www.therealtimes.org">
        <img src="cid:screenshot" alt="Website Snapshot" style="width:90%;">
      </a>
      <p>Click the image to visit our website!</p>
    `,
    attachments: [
      {
        filename: 'screenshot.png',
        content: screenshot,
        cid: 'screenshot' // same cid value as in the html img src
      }
    ]
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
})();
