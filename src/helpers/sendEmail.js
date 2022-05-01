const nodemailer = require('nodemailer')

async function sendEmail(to, html) {
    // let testAccount = await nodemailer.createTestAccount()
    // console.log('testAccount', testAccount)

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'legxsim36is55w5v@ethereal.email',
            pass: 'JjJx7R3YysG1EZhFtJ'
        }
    })
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to, // list of receivers
        subject: "Change Password", // Subject line
        html, // plain text body
      });
    
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
}

module.exports = sendEmail