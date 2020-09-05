const SwarmDBO = require('../dbo/swarm.server.dbo');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { v5: uuidv5 } = require('uuid');
const logger = require('../../../logger/handleError')
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
        if (token == null || process.env.ACCESS_TOKEN_SECRET.split(',').indexOf(token) == -1) {
            return res.status(403).send({ auth: false, message: "Please provide valid token" });
        }
        let validAtSign = await SwarmDBO.checkValidAtsign(req.body.atsign);
        if (!validAtSign) {
            res.status(400).json({ message: 'Atsign is invalid' });
            return;
        }
        req.body.atsign = req.body.atsign.toLowerCase().replace('@', '')
        
        const uuid = uuidv5(req.protocol + '://' + req.hostname + '' + req.url+'/'+req.body.atsign+'/'+Date.now(), uuidv5.URL); //need to change this
        
        const secretkey = crypto.createHmac('sha512', process.env.SHA_SECRET)
            .update(uuid)
            .digest('hex');
        const { error, value } = await SwarmDBO.getPortForAtsign(req.body.atsign, { uuid, secretkey, apiKey: token })
        const QRcode = await createQRCode(secretkey);
        if (value) {
            res.status(200).json({ message: 'Created Successfully', data: value, QRcode: QRcode })
        } else {
            if (error.type === 'info') {
                res.status(400).json({ message: error.message })
            } else {
                logger(error.data, req)
                res.status(500).json({ message: error.message })
            }
        }
    } catch (error) {
        logger(error, req)
        res.status(500).json({ message: 'Something went wrong, please try again later.' })
    }
}

exports.removeSwarm = async function (req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[0]
        if (token == null || process.env.ACCESS_TOKEN_SECRET.split(',').indexOf(token) == -1) {
            return res.status(403).send({ auth: false, message: "Please provide valid token" });
        }
        let validAtSign = await SwarmDBO.checkValidAtsign(req.params.atsign);
        if (!validAtSign) {
            res.status(400).json({ message: 'Atsign is invalid' });
            return;
        }
        req.params.atsign = req.params.atsign.toLowerCase().replace('@', '')
        const { error, value } = await SwarmDBO.deletePortForAtsign(req.params.atsign, token)
        if (value) {
            res.status(200).json({ message: 'Removed Successfully', data: value })
        } else {
            if (error.type === 'info') {
                res.status(400).json({ message: error.message })
            } else {
                logger(error.data, req)
                res.status(500).json({ message: error.message })
            }
        }
    } catch (error) {
        logger(error, req)
        res.status(500).json({ message: 'Something went wrong, please try again later.' })
    }
}
