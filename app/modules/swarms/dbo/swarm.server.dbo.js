let mongoose = require('mongoose');
let AvailableSwarm = require('./../models/availableswarms.server.model');
let SwarmAtsign = require('./../models/swarmatsign.server.model');
let ArchivedSwarmAtsign = require('./../models/archivedswarmatsign.server.model');
const INITAL_PORT_FOR_SWARM = process.env.INITAL_PORT_FOR_SWARM || 1000;
const MAX_ATTEMPT_COUNT = process.env.MAX_ATTEMPT_COUNT || 3;
const MAX_PORT_PER_SYSTEM = process.env.MAX_PORT_PER_SYSTEM || 58000
const checkValidAtsign = function (atsign) {
  return atsign ? true : false;
}

const getPortForAtsign = async function (atsign, data = {}, attemptCount = 1) {
  try {
    if (attemptCount <= MAX_ATTEMPT_COUNT) {
      let swarmExist = await SwarmAtsign.findOne({ atsign: atsign }).lean();
      if (swarmExist) {
        swarmExist['existing'] = true
        return { value: swarmExist }
      }

      //Assign new Swarm
      const availableSwarm = await AvailableSwarm.findOne({ isAvailableToUse: true })
      if (!availableSwarm) return { error: { type: 'info', message: 'No swarm is available to use or all port utilized' } }

      const swarmWithMaxPortNo = await SwarmAtsign.find({ swarmId: availableSwarm.swarmId }).sort({ port: -1 }).limit(1);
      
      let nextAssignablePort = swarmWithMaxPortNo[0] && swarmWithMaxPortNo[0].port ? swarmWithMaxPortNo[0].port+1 : INITAL_PORT_FOR_SWARM
      while (availableSwarm.blockedPorts.indexOf(nextAssignablePort) !== -1) {
        nextAssignablePort++;
        if(nextAssignablePort > MAX_PORT_PER_SYSTEM ){
          await AvailableSwarm.findOneAndUpdate({swarmId:availableSwarm.swarmId},{isAvailableToUse:false})
          return getPortForAtsign(atsign,data,++attemptCount)
        }
      }
      if(nextAssignablePort > MAX_PORT_PER_SYSTEM ){
        await AvailableSwarm.findOneAndUpdate({swarmId:availableSwarm.swarmId},{isAvailableToUse:false})
        return getPortForAtsign(atsign,data,++attemptCount)
      }
      data['attemptCount'] = attemptCount;      
      return createPortForAtsign(availableSwarm.swarmId, nextAssignablePort, atsign, data)
    } else {
      return { error: { type: 'info', message: 'Maximum no of retries reached. Please try again later' } }
    }
  } catch (error) {
    return { error: { type: 'error', message: 'Something went wrong, please try again later.', data: error } }
  }
}

const createPortForAtsign = async function (swarmId, port, atsign, data) {
  try {
    if (!atsign || !data.uuid) {
      return { error: { type: 'info', message: 'Required details are missing' } }
    }
    if (swarmId, port, atsign) {
      const swarm = {
        swarmId,
        port,
        atsign,
        uuid: data.uuid || null,
        secretkey: data.secretkey || null,
        status: 0,
        apiKey:data.apiKey || ''
      }
      const createdSwarmForAtsign = await SwarmAtsign.create(swarm);
      if (createdSwarmForAtsign) {
        if(port >= MAX_PORT_PER_SYSTEM) AvailableSwarm.findOneAndUpdate({swarmId},{isAvailableToUse:false})
        return { value: createdSwarmForAtsign }
      } else {
        return getPortForAtsign(atsign, data)
      }
    } else {
      return getPortForAtsign(atsign, data, ++data.attemptCount)
    }
  } catch (error) {
    if ( error && error.name == 'MongoError' &&error.code === 11000  ) {
      return getPortForAtsign(atsign, data, ++data.attemptCount)
    }
    return { error: { type: 'error', message: 'Something went wrong, please try again later.', data: error } }
  }

}

const deletePortForAtsign = async function(atsign,apiKey){
  try{
    const swarmByAtsign = await SwarmAtsign.findOne({atsign:atsign}).lean()
    if(!swarmByAtsign){
      return{error:{type:'info',message:'Invalid Atsign'}}
    }
    swarmByAtsign.apiKey = apiKey
    delete swarmByAtsign._id
    const deleteAtsignPromise = await Promise.all([SwarmAtsign.deleteOne({atsign:atsign}),ArchivedSwarmAtsign.create(swarmByAtsign)])
    if(deleteAtsignPromise[0] && deleteAtsignPromise[1]){
      return {value:swarmByAtsign}
    }else{
      return {error:{type:'info',message:'Something went wrong, please try again later.'}}
    }
  }catch(error){
    return {error:{type:'error',message:'Something went wrong, please try again later.'}}
  }
}

module.exports = {
  checkValidAtsign,
  getPortForAtsign,
  createPortForAtsign,
  deletePortForAtsign
}