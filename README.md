# Registrar Node


- This is an API built to start or stop new infrastructure(swarm) with respect to atsign
- For any questions contact ashish@atsign.com

# Usage:
* All requests must come with a header of `{"Authorization" : "Apikey"}`
* 2 Routes
    * /api/assignswarm
        - This is a post API responsible for assigning swarmId & port for creating new infrastructure
        
            Sample Request JSON
            
            {"atsign":"@tsign"} 
        - Response will be a json object 
        
            Sample Response JSON 

            { 
                message: 'Created Successfully',
                data: {
                    "_id" : ObjectId(),
                    "swarmId" : ${swarmId},
                    "port" : ${port},
                    "atsign" : ${atsign}
                    "uuid" : ${uuid},
                    "secretkey" :${secretkey},
                    "status" : false,
                    "apiKey" : ${API_KEY},
                    "updatedAt" : ISODate(),
                    "createdAt" : ISODate(),
                    "__v" : 0
                },
                QRcode: QRcode
            }
    * /api/removesecondary
        - This is a post API responsible for stopping existing infrastructure for given atsign
        
            Sample Request JSON 
            
            {"atsign":"@tsign"} 
        - Response will be a json object
        
            Sample Response JSON 

            { 
                message: 'Removed Successfully',
                data: {
                    "_id" : ObjectId(),
                    "swarmId" : ${swarmId},
                    "port" : ${port},
                    "atsign" : ${atsign}
                    "uuid" : ${uuid},
                    "secretkey" :${secretkey},
                    "status" : false,
                    "apiKey" : ${API_KEY},
                    "updatedAt" : ISODate(),
                    "createdAt" : ISODate(),
                    "__v" : 0
                }
            }

    
### To Run Locally

1. `$ git clone https://github.com/athandle/infrastructure_api`
2. `$ npm install`
3. Set up Digital Ocean Account and get API token
4. Install MongoDB
5. Setup ["INFRA_ROOT_MANAGER"](https://github.com/athandle/infrastructure_root_manager)
6. Create .env file
```
NODE_ENV=${Environment(development/production)}
SECRET=${Secret key for crypto}
DB_URL=${MongoDB URL}
PORT=${port to run api on}
HOST=${cloud machine ip}
ACCESS_TOKEN_SECRET=${Digital Ocean API Token}
EMAIL=${Email account to send mails(must be a gmail account)}
PASSWORD=${Password for email account}
ADMIN_EMAIL=${Admin email id}
INITAL_PORT_FOR_SWARM=${Minimum swarm PORT from which we need to assign port}
MAX_PORT_PER_SYSTEM=${Maximum swarm PORT from which we need to assign port}
MAX_ATTEMPT_COUNT=${Max retries count for assigning port. Ideal value must be 3}
INFRA_ROOT_CREATE_URL=${Create API URL for INFRA_ROOT_MANAGER server}
INFRA_ROOT_CREATE_URL=${Create API URL for INFRA_ROOT_MANAGER server}
```
7. Run npm start to start a server

