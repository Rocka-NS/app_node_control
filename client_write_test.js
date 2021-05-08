const { OPCUAClient, makeBrowsePath, AttributeIds, resolveNodeId, TimestampsToReturn, StatusCodes, DataType} = require("node-opcua");
    const async = require("async");

    // const endpointUrl = "opc.tcp://<hostname>:4334/UA/MyLittleServer";
    const endpointUrl = "opc.tcp://192.168.1.241:4840";
    const client = OPCUAClient.create({
        endpoint_must_exist: false
    });
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
    
    async.series([
    
        // step 1 : connect to
        function(callback)  {
            client.connect(endpointUrl, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :", endpointUrl);
              } else {
                console.log("connected !");
              }
              callback(err);
            });
        },
    
        // step 2 : createSession
        function(callback) {
            client.createSession(function(err, session) {
              if (err) {
                return callback(err);
              }
              the_session = session;
              callback();
            });
        },
    
        // step 3 : browse
        function(callback) {
           the_session.browse("RootFolder", function(err, browseResult) {
             if (!err) {
               console.log("Browsing rootfolder: ");
               for (let reference of browseResult.references) {
                 console.log(reference.browseName.toString(), reference.nodeId.toString());
               }
             }
             callback(err);
           });
        },
    
        // step 4 : read a variable with readVariableValue
        function(callback) {
           the_session.read({nodeId: "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"", attributeId: AttributeIds.Value}, (err, dataValue) => {
             if (!err) {
               console.log(" Is blinky? : ", dataValue.toString());
             }
             callback(err);
           });
        },
    
        // step 4' : read a variable with read
        async function(callback) {
           const maxAge = 0;
           const nodeToRead = {
             nodeId: "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"",
             attributeId: AttributeIds.Value
           };
           
           the_session.read(nodeToRead, maxAge, function(err, dataValue) {
             if (!err) {
               console.log(" Is Blinky? : ", dataValue.toString());
             }
             callback(err);
            });
            const myVaiableNodeId = "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"";
            const statusCode = await the_session.write({
                nodeId: myVaiableNodeId,

                attributeId: AttributeIds.Value,
                value: {
                    statusCode: StatusCodes.Good,
                    value: {
                        dataType: DataType.Boolean,
                        value: false,
                    },
                },
            });
            /* const nodesToWrite = [{
                nodeId: "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"",
                attributeId: opcua.AttributeIds.Value,
                indexRange: null,
                value: { 
                    value: { 
                        dataType: opcua.DataType.Boolean,
                         value: true
                    }
              }
            }];

            the_session.write(nodesToWrite, function(err,statusCode,diagnosticInfo) {
                if (!err) {
                    console.log(" write ok" );
                    console.log(diagnosticInfo);
                    console.log(statusCode);
                }
                callback(err);
            });   */


        },
                // step 4 : read a variable with readVariableValue
        function(callback) {
           the_session.read({nodeId: "ns=3;s=\"IO_Sim_blinky_DB\".\"start_blinky\"", attributeId: AttributeIds.Value}, (err, dataValue) => {
             if (!err) {
               console.log(" Is blinky? : ", dataValue.toString());
             }
             callback(err);
           });
        },
    
        // step 5: install a subscription and install a monitored item for 10 seconds
        function(callback) {
           const subscriptionOptions = {
             maxNotificationsPerPublish: 1000,
             publishingEnabled: true,
             requestedLifetimeCount: 100,
             requestedMaxKeepAliveCount: 10,
             requestedPublishingInterval: 1000
           };
           the_session.createSubscription2(subscriptionOptions, (err, subscription) => {
             if (err) {
               return callback(err);
             }
           
             the_subscription = subscription;
           
             the_subscription
               .on("started", () => {
                 console.log(
                   "subscription started for 2 seconds - subscriptionId=",
                   the_subscription.subscriptionId
                 );
               })
               .on("keepalive", function() {
                 console.log("subscription keepalive");
               })
               .on("terminated", function() {
                 console.log("terminated");
               });
             callback();
           });
        },
        function(callback) {
           // install monitored item
           const itemToMonitor = {
             nodeId: resolveNodeId("ns=3;s=\"IO_Sim_blinky_DB\".\"Led0\""),
             attributeId: AttributeIds.Value
           };
           const monitoringParamaters = {
             samplingInterval: 100,
             discardOldest: true,
             queueSize: 10
           };
           
           the_subscription.monitor(
             itemToMonitor,
             monitoringParamaters,
             TimestampsToReturn.Both,
             (err, monitoredItem) => {
               monitoredItem.on("changed", function(dataValue) {
                 console.log(
                   "monitored item changed:  LED1 on?  ",
                   dataValue.value.value
                 );
               });
               callback();
             }
           );
           console.log("-------------------------------------");
        },
        function(callback) {
            // wait a little bit : 10 seconds
            setTimeout(()=>callback(), 10*1000);
        },
        // terminate session
        function(callback) {
            the_subscription.terminate(callback);;
        },
        // close session
        function(callback) {
            the_session.close(function(err) {
              if (err) {
                console.log("closing session failed ?");
              }
              callback();
            });
        }
    
    ],
    function(err) {
        if (err) {
            console.log(" failure ",err);
        } else {
            console.log("done!");
        }
        client.disconnect(function(){});
    }) ;