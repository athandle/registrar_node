const SwarmDBO = require('../dbo/swarm.server.dbo');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { v5: uuidv5 } = require('uuid');
const logger = require('../../../logger/handleError')
const axios = require('axios')

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
            return res.status(401).send({ auth: false, message: "Please provide valid token" });
        }
        let atSign = req.body.atsign;
        let validAtSign = await SwarmDBO.checkValidAtsign(atSign);
        if (!validAtSign) {
            res.status(400).json({ message: 'Atsign is invalid' });
            return;
        }
        atSign = atSign.replace('@', '')

        const uuid = uuidv5(req.protocol + '://' + req.hostname + '' + req.url + '/' + atSign + '/' + Date.now(), uuidv5.URL); //need to change this
        const secretkey = crypto.createHmac('sha512', process.env.SECRET)
            .update(uuid)
            .digest('hex');
        const { error, value } = await SwarmDBO.getPortForAtsign(atSign, { uuid, secretkey, apiKey: token })
        const QRcode = await createQRCode(`@${atSign}:${secretkey}`);

        if (value) {
            if (process.env.CREATE_INFRASTRUCTURE_URL && !value.existing) {
                const response = await axios.post(process.env.CREATE_INFRASTRUCTURE_URL, { data: value, QRcode: QRcode }, { headers: { authorization: process.env.CREATE_INFRASTRUCTURE_TOKEN } })
            }
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

exports.removesecondary = async function (req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[0]
        if (token == null || process.env.ACCESS_TOKEN_SECRET.split(',').indexOf(token) == -1) {
            return res.status(401).send({ auth: false, message: "Please provide valid token" });
        }
        let atSign = req.body.atsign;
        let validAtSign = await SwarmDBO.checkValidAtsign(atSign);
        if (!validAtSign) {
            res.status(400).json({ message: 'Atsign is invalid' });
            return;
        }

        atSign = atSign.replace('@', '')
        const { error, value } = await SwarmDBO.deletePortForAtsign(atSign, token)
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
