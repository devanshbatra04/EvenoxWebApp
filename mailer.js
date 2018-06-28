module.exports = function(name, email,req, res) {

    var nodemailer               = require('nodemailer'),
        mongoose                 = require("mongoose"),
        Subscriber               = require('./models/subscriber');
    console.log(name, email);


    let transporter = nodemailer.createTransport({
        host: 'webmail.eventox.in',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "no-reply@eventox.in", // generated ethereal user
            pass: "randomPassword" // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Aavesh Dagar" <no-reply@eventox.in>', // sender address
        to: email, // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(info);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log(info);

        Subscriber.findOne({name, email}, function(err,u){
            if(!u){
                Subscriber.create({
                    name, email
                }, function(err, Subscriber){
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(Subscriber);
                    }
                });
            }
            else {
                console.log("user exists");
            }

        });


        res.send(200);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
};