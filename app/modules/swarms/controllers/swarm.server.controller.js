var swarmDbo = require('../dbo/swarm.server.dbo');
var config = require('../../../config/config');
const e = require('express');
const { v5: uuidv5 } = require('uuid');

exports.assignSwarm = async function (req, res) {
    console.log(req.body)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[0]
    if (token == null || config.ACCESS_TOKEN_SECRET !== token) {
        return res.status(403).send({ auth: false, message: "Please provide valid token" });
    }
    let validAtSign = await swarmDbo.checkValidAtsign(req.body.atsign);
    // let validAtSign = await swarmDbo.checkAvailableSwarm();
    let initialValue = 10000;
    
    let fetchedData = await swarmDbo.checkAvailablePort(initialValue);
    console.log(fetchedData)
    fetchedData['atsign']=req.body.atsign;
    fetchedData['uuid']= uuidv5('https://www.xyz.org/', uuidv5.URL); //need to change this
    // fetchedData['uuid']=uuid.v5();
    // let port = await swarmDbo.checkValidPort();
    console.log(fetchedData)
    if (validAtSign && fetchedData.port) {
        swarmDbo.assignSwarm(fetchedData, function (err, result) {
            if (err) {
                res.status(400).send({
                    success: false,
                    message: err
                })
            } else {
                res.status(200).send('success');
            }
        })
    } else {
        return res.status(403).send({ auth: false, message: "Please provide valid atsign" });
    }
}
