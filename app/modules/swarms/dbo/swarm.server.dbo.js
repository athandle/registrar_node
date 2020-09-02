let mongoose = require('mongoose');
let AvailableSwarm = mongoose.model('availableswarm');
let SwarmAtsign = mongoose.model('Swarmatsign');

exports.checkValidAtsign = function (atsign) {
  return true;
}
checkAvailablePort = function (initialValue) {
  console.log(initialValue)
  return new Promise(function (resolve, reject) {
    SwarmAtsign.findOne({ port: initialValue }, function (err, result) {
      console.log(result)
      if (err) {
        resolve();
      } else if (!result) {
        AvailableSwarm.findOne({ "blocked_ports": initialValue }, function (err, results) {
          console.log(results)
          if (err) {
            resolve();
          } else if (!results) {
            let data = {};
            data['port'] = initialValue;
            AvailableSwarm.findOne({}, function (err, resultVal) {
              data['swarm_id'] = resultVal.swarm_id;
              console.log(data)

              resolve(data);
            })
          } else {
            initialValue += 1;
            checkAvailablePort(initialValue);
          }
        })
      } else {
        initialValue += 1;
        checkAvailablePort(initialValue);
      }
    });
  })
}
exports.checkAvailablePort = checkAvailablePort;

exports.assignSwarm = function (data, callback) {
  let swarm = new SwarmAtsign();
  swarm['atsign'] = data.atsign;
  swarm['port'] = data.port;
  swarm['swarm_id'] = data.swarm_id;
  swarm['uuid'] = data.uuid;
  swarm['status'] = 0;
  swarm.save(function (err, result) {
    var userData = result;
    if (err) {
      callback('Something went wrong');
    } else if (!result) {
      callback('Something went wrong');
    } else {
      callback(null, userData);
    }
  });

};