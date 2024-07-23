require('dotenv').config();
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Take a screenshot
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });
  await page.goto('https://www.therealtimes.org');
  const screenshotPath = path.join(__dirname, 'screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await browser.close();

  // Read the screenshot file
  const screenshot = fs.readFileSync(screenshotPath);

  // Create a Nodemailer transporter for ProtonMail using ProtonMail Bridge
  const transporter = nodemailer.createTransport({
    host: process.env.PROTONMAIL_SMTP_HOST,
    port: process.env.PROTONMAIL_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.PROTONMAIL_EMAIL,
      pass: process.env.PROTONMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });

  // Define email options
  const mailOptions = {
    from: 'editor@therealtimes.org',
    to: 'jiangjili@gmail.com', 
    cc: 'josephbillings@gmail.com',
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
