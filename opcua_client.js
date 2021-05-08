const { OPCUAClient, makeBrowsePath, AttributeIds, resolveNodeId, TimestampsToReturn, StatusCodes, DataType} = require("node-opcua");
const async = require("async");


const PlcClient = class {

    credentials(_id,endpoint, nodeId, dataType, value) {
        this._id =_id;
        this.endpoint = endpoint;
        this.nodeId = nodeId;
        this.dataType = dataType;
        this.value = value;
    }
    read() {
        function step1(){
            client.connect(endpointUrl, function(err) {
                if (err) {
                  console.log(" cannot connect to endpoint :", endpointUrl);
                } else {
                  console.log("connected !");
                }
                callback(err);
              });
        };
        function step1(){
            client.createSession(function(err, session) {
                if (err) {
                  return callback(err);
                }
                the_session = session;
                callback();
              });
        };
        function step1(){
            the_session.browse("RootFolder", function(err, browseResult) {
                if (!err) {
                  console.log("Browsing rootfolder: ");
                  for (let reference of browseResult.references) {
                    console.log(reference.browseName.toString(), reference.nodeId.toString());
                  }
                }
                callback(err);
              });
        };
        function step1(){

            the_session.read({nodeId: "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"", attributeId: AttributeIds.Value}, (err, dataValue) => {
                if (!err) {
                  console.log(" Is blinky? : ", dataValue.toString());
                }
                callback(err);
              });
        };
        function step1(){
            the_subscription.terminate(callback);;
            the_session.close(function(err) {
              if (err) {
                console.log("closing session failed ?");
              }
              callback();
            });
        
        };

        function main(done) {
            async.series(
                [

                ],

                (err, result) => {
                    if (err) {
                        console.log("Failed", err.message);
                        return;
                    }
                    console.log("done ! final result is ", result);
                    done(err);
                }
            )
        }
    }


}