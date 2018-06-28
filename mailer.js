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
        subject: 'Welcome to Eventox', // Subject line
        text: 'Eventox is under construction and will be released as soon as possible. You will be the first to know. Eventox is going to be awesome and it will change your event experience , it will make every event experience more exciting.It doesn\'t matter whether you are an Event Organizer , Participant , Sponsor , Event Management Company or a Freelancer. We have something for each one of you.\n' +
        'Sit tight and wait  because, Organizing and participating in events will be better than ever.', // plain text body
        html: '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<title>A Responsive Email Template</title>\n' +
        '\n' +
        '<meta charset="utf-8">\n' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '<meta http-equiv="X-UA-Compatible" content="IE=edge" />\n' +
        '<style type="text/css">\n' +
        '    /* CLIENT-SPECIFIC STYLES */\n' +
        '    body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;} /* Prevent WebKit and Windows mobile changing default text sizes */\n' +
        '    table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;} /* Remove spacing between tables in Outlook 2007 and up */\n' +
        '    img{-ms-interpolation-mode: bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */\n' +
        '\n' +
        '    /* RESET STYLES */\n' +
        '    img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}\n' +
        '    table{border-collapse: collapse !important;}\n' +
        '    body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}\n' +
        '\n' +
        '    /* iOS BLUE LINKS */\n' +
        '    a[x-apple-data-detectors] {\n' +
        '        color: inherit !important;\n' +
        '        text-decoration: none !important;\n' +
        '        font-size: inherit !important;\n' +
        '        font-family: inherit !important;\n' +
        '        font-weight: inherit !important;\n' +
        '        line-height: inherit !important;\n' +
        '    }\n' +
        '\n' +
        '    /* MOBILE STYLES */\n' +
        '    @media screen and (max-width: 525px) {\n' +
        '\n' +
        '        /* ALLOWS FOR FLUID TABLES */\n' +
        '        .wrapper {\n' +
        '          width: 100% !important;\n' +
        '        \tmax-width: 100% !important;\n' +
        '        }\n' +
        '\n' +
        '        /* ADJUSTS LAYOUT OF LOGO IMAGE */\n' +
        '        .logo img {\n' +
        '          margin: 0 auto !important;\n' +
        '        }\n' +
        '\n' +
        '        /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */\n' +
        '        .mobile-hide {\n' +
        '          display: none !important;\n' +
        '        }\n' +
        '\n' +
        '        .img-max {\n' +
        '          max-width: 100% !important;\n' +
        '          width: 100% !important;\n' +
        '          height: auto !important;\n' +
        '        }\n' +
        '\n' +
        '        /* FULL-WIDTH TABLES */\n' +
        '        .responsive-table {\n' +
        '          width: 100% !important;\n' +
        '        }\n' +
        '\n' +
        '        /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */\n' +
        '        .padding {\n' +
        '          padding: 10px 5% 15px 5% !important;\n' +
        '        }\n' +
        '\n' +
        '        .padding-meta {\n' +
        '          padding: 30px 5% 0px 5% !important;\n' +
        '          text-align: center;\n' +
        '        }\n' +
        '\n' +
        '        .no-padding {\n' +
        '          padding: 0 !important;\n' +
        '        }\n' +
        '\n' +
        '        .section-padding {\n' +
        '          padding: 50px 15px 50px 15px !important;\n' +
        '        }\n' +
        '           /* Custom css*/\n' +
        '          /* #evrl {\n' +
        '            font-size: 70px;\n' +
        '           }\n' +
        '            #orge\n' +
        '            {\n' +
        '                color: #fe001a;\n' +
        '            }\n' +
        '*/\n' +
        '\n' +
        '\n' +
        '        /* ADJUST BUTTONS ON MOBILE */\n' +
        '        .mobile-button-container {\n' +
        '            margin: 0 auto;\n' +
        '            width: 100% !important;\n' +
        '        }\n' +
        '\n' +
        '        .mobile-button {\n' +
        '            padding: 15px !important;\n' +
        '            border: 0 !important;\n' +
        '            font-size: 16px !important;\n' +
        '            display: block !important;\n' +
        '        }\n' +
        '\n' +
        '    }\n' +
        '\n' +
        '    /* ANDROID CENTER FIX */\n' +
        '    div[style*="margin: 16px 0;"] { margin: 0 !important; }\n' +
        '</style>\n' +
        '</head>\n' +
        '<body style="margin: 0 !important; padding: 0 !important;">\n' +
        '\n' +
        '<!-- HIDDEN PREHEADER TEXT -->\n' +
        '<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">\n' +
        '    Thank you for subscribing. We are pleased to have you onboard...\n' +
        '</div>\n' +
        '\n' +
        '<!-- HEADER -->\n' +
        '<table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
        '    <tr>\n' +
        '        <td bgcolor="#333333" align="center">\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">\n' +
        '            <tr>\n' +
        '            <td align="center" valign="top" width="500">\n' +
        '            <![endif]-->\n' +
        '            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="wrapper">\n' +
        '                <tr>\n' +
        '                    <td align="center" valign="top" style="padding: 15px 0;" class="logo">\n' +
        '                        <a href="http://eventox.in/" target="_blank">\n' +
        '                            <img alt="Logo" src="https://thumb.ibb.co/k49fPo/logo.png" width="100" height="100" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 16px;" border="0">\n' +
        '                        </a>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '            </table>\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            </td>\n' +
        '            </tr>\n' +
        '            </table>\n' +
        '            <![endif]-->\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td bgcolor="#ffffff" align="center" style="padding: 70px 15px 70px 15px;" class="section-padding">\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">\n' +
        '            <tr>\n' +
        '            <td align="center" valign="top" width="500">\n' +
        '            <![endif]-->\n' +
        '            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">\n' +
        '                <tr>\n' +
        '                    <td>\n' +
        '                        <!-- HERO IMAGE -->\n' +
        '                        <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
        '                            <tr>\n' +
        '                              \t<td class="padding" align="center">\n' +
        '                                    <a href="http://eventox.in" target="_blank">\n' +
        '                                        <img src="https://thumb.ibb.co/nJdwx8/welcome.png" width="500" height="400" border="0" alt="Insert alt text here" style="display: block; color: #666666;  font-family: Helvetica, arial, sans-serif; font-size: 16px;" class="img-max">\n' +
        '                                    </a>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>\n' +
        '                                    <!-- COPY -->\n' +
        '                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
        '                                        <tr>\n' +
        '                                            <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 30px;" class="padding">Welcome Onboard!!</td>\n' +
        '                                        </tr>\n' +
        '                                        <tr>\n' +
        '                                            <td align="center" style="padding: 20px 0 0 0; font-size: 20px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">\n' +
        '                                                \n' +
        '\n' +
        '                                                 Eventox is under construction and will be released as soon as possible. You will be the first to know. Eventox is going to be awesome and it will change your event experience , it will make every event experience more exciting.It doesn\'t matter whether you are an Event Organizer , Participant , Sponsor , Event Management Company or a Freelancer. We have something for each one of you.\n' +
        'Sit tight and wait  because, Organizing and participating in events will be better than ever.\n' +
        '<p><b>Welcome to the Event revolution</b></p>\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                            </td>\n' +
        '                                        </tr>\n' +
        '                                    </table>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td align="center">\n' +
        '                                    <!-- BULLETPROOF BUTTON -->\n' +
        '                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
        '                                        <tr>\n' +
        '                                            <td align="center" style="padding-top: 25px;" class="padding">\n' +
        '                                                <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">\n' +
        '                                                    <tr>\n' +
        '                                                    \t<td align="center" style="border-radius: 3px;" bgcolor="#FC8200"><a href="http://eventox.in" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; border-radius: 3px; padding: 15px 25px; border: 1px solid #FC8200; display: inline-block;" class="mobile-button">Read More &rarr;</a></td>\n' +
        '                                                    </tr>\n' +
        '                                                </table>\n' +
        '                                            </td>\n' +
        '                                        </tr>\n' +
        '                                    </table>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                        </table>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '            </table>\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            </td>\n' +
        '            </tr>\n' +
        '            </table>\n' +
        '            <![endif]-->\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '    \n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '<!-- \n' +
        '               ----- BLOG STARTS HERE ----- BLOG STARTS HERE ----- BLOG STARTS HERE ----- BLOG STARTS HERE ----- BLOG STARTS HERE -----  -->\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '    \n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                          <!-- Upcoming Events Upcoming Events Upcoming Events Upcoming Events -->\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '    \n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '   \n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '<!-- \n' +
        '                                Footer Starts Here -->\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '    <tr>\n' +
        '        <td bgcolor="#ffffff" align="center" style="padding: 20px 0px;">\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            <table align="center" border="0" cellspacing="0" cellpadding="0" width="500">\n' +
        '            <tr>\n' +
        '            <td align="center" valign="top" width="500">\n' +
        '            <![endif]-->\n' +
        '            <!-- UNSUBSCRIBE COPY -->\n' +
        '            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 500px;" class="responsive-table">\n' +
        '                <tr>\n' +
        '                    <td align="center" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">\n' +
        '                        NSIT-Delhi , Dwarka , New Delhi-110075, India\n' +
        '                        <br>\n' +
        '                        <a href="#" target="_blank" style="color: #666666; text-decoration: none;">Unsubscribe</a>\n' +
        '                        <span style="font-family: Arial, sans-serif; font-size: 12px; color: #444444;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>\n' +
        '                        <a href="http://eventox.in/" target="_blank" style="color: #666666; text-decoration: none;">Visit Eventox.in</a>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '            </table>\n' +
        '            <!--[if (gte mso 9)|(IE)]>\n' +
        '            </td>\n' +
        '            </tr>\n' +
        '            </table>\n' +
        '            <![endif]-->\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '</body>\n' +
        '</html>\n'// html body
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