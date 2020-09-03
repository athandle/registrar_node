const logger = require('./log'),nodemailer = require('nodemailer');

function logError(err, req, res) {
    logger.error(err);
    if (req) {
        sendErrorEmail([err.stack, req.headers], req.protocol + '://' + req.get('host') + req.originalUrl);
    } else {
        sendErrorEmail([err.stack, err.sql], process.env.APP_URL || 'Error');
    }
    if (res) {
        res.send({ status: 'error', message: 'Something went wrong, please try agin later', data: {} });
    }
    return;
}

function replaceErrors(key, value) {
    if (value instanceof Error) {
        let error = {};

        Object.getOwnPropertyNames(value).forEach((key) => {
            error[key] = value[key];
        });
        return error;
    }
    return value;
}

function sendErrorEmail(err, url) {
    if(!process.env.EMAIL || !process.env.PASSWORD || !process.env.ADMIN_EMAIL){
        return
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: "REGISTRAR NODE",
        to: process.env.ADMIN_EMAIL,
        subject: 'REGISTRAR NODE ERROR',
        html: `Hi<br/><br/> Got this error: <br/>${JSON.stringify(err, replaceErrors)} <br/>Environment - ${url}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}
module.exports = logError;