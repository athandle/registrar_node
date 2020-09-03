const SwarmDBO = require('../dbo/swarm.server.dbo');
var config = require('../../../config/config');
const e = require('express');
const { v5: uuidv5 } = require('uuid');

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
        
        const uuid = uuidv5(req.protocol+'://'+req.hostname+''+req.url, uuidv5.URL); //need to change this
        const { error, value } = await SwarmDBO.getPortForAtsign(req.body.atsign, { uuid })
        if (value) {
            res.status(200).json({ message: 'Created Successfully', data: value })
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
