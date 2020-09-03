const SwarmDBO = require('../dbo/swarm.server.dbo');
var config = require('../../../config/config');
const e = require('express');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { v5: uuidv5 } = require('uuid');
 async function createQRCode(text) {
    const dataURL = await QRCode.toDataURL(text).catch((e) => console.error(e));
    
    if (!dataURL) {
        throw new Error('Unable to generate QR Code');
    }
    return dataURL;
}
exports.assignSwarm = async function (req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[0]
        if (token == null || config.ACCESS_TOKEN_SECRET !== token) {
            return res.status(403).send({ auth: false, message: "Please provide valid token" });
        }
        let validAtSign = await SwarmDBO.checkValidAtsign(req.body.atsign);
        if (!validAtSign) {
            res.status(400).json({ message: 'Atsign is invalid' });
            return;
        }
        req.body.atsign = req.body.atsign.replace('@', '')
        
        const uuid = uuidv5(req.protocol + '://' + req.hostname + '' + req.url, uuidv5.URL); //need to change this
        const secret = 'abcdefg';
        const secretkey = crypto.createHmac('sha512', secret)
        .update(uuid)
        .digest('hex');
        
        
       const { error, value } = await SwarmDBO.getPortForAtsign(req.body.atsign, { uuid,secretkey })
       const QRcode = await createQRCode(secretkey);
       if (value) {
            res.status(200).json({ message: 'Created Successfully', data: value, QRcode:QRcode })
        } else {
            if (error.type === 'info') {
                res.status(400).json({ message: error.message })
            } else {
                res.status(500).json({ message: error.message })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong, please try again later.' })
    }

}
