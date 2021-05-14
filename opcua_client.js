/* module.exports = {
    init: () => {
        init();
    },
    connect: (address) => {
        connect(address);
    },
    send: (data) => {
        send(data);
    },
    close: () => {
        close();
    }
}

const { OPCUAClient, makeBrowsePath, AttributeIds, resolveNodeId, TimestampsToReturn, StatusCodes, DataType} = require("node-opcua");
const async = require("async");

const client = OPCUAClient.create({
    endpoint_must_exist: false
});


const client = OPCUAClient.create({
    connectionStrategy: {
        maxRetry: 3,
        initialDelay: 1000,
        maxDelay: 4 * 1000
    },
    keepSessionAlive: true,
    endpoint_must_exist: false
});


credentials(_id,endpoint, nodeId, dataType, value) {
    this._id =_id;
    this.endpoint = endpoint;
    this.nodeId = nodeId;
    this.dataType = dataType;
    this.value = value;
};

client.on("backoff", (retry, delay) =>
  console.log(
    "still trying to connect to ",
    endpointUrl,
    ": retry =",
    retry,
    "next attempt in ",
    delay / 1000,
    "seconds"
  )
);

let the_session, the_subscription;
function init(){

};

function connect(endpoint){
    let endpointUrl = endpoint;
    
};
 */

/* 
    var foo, callback;
    async.function(function(response) {
        foo = "foobar";
    
        if( typeof callback == 'function' ){
            callback(foo);
        }
    });
    
    module.exports = function(cb){
        if(typeof foo != 'undefined'){
            cb(foo); // If foo is already define, I don't wait.
        } else {
            callback = cb;
        }
    } */

const { OPCUAClient, makeBrowsePath, AttributeIds, resolveNodeId, TimestampsToReturn, StatusCodes, DataType} = require("node-opcua");
const async = require("async");

class OpcUaClient {

    credentials(_id,endpoint, nodeId, dataType, value) {
        this._id =_id;
        this.endpoint = endpoint;
        this.nodeId = nodeId;
        this.dataType = dataType;
        this.value = value;
    };
    
      // instantiate node-opcua client
    this.opcClient =  OPCUAClient.create({
        connectionStrategy: {
            maxRetry: 3,
            initialDelay: 1000,
            maxDelay: 4 * 1000
        },
        keepSessionAlive: true,
        endpoint_must_exist: false
    });
};