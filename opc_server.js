"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_opcua_1 = require("node-opcua");
async function add_some_variables_variation2(server) {
    // get the addressSpace
    const addressSpace = server.engine.addressSpace;
    // get own namespace
    const namespace = addressSpace.getOwnNamespace();
    const myObject = namespace.addObject({
        browseName: "MyObject",
        organizedBy: addressSpace.rootFolder.objects
    });
    await (async function technique1() {
        const myVariable1 = namespace.addVariable({
            browseName: "MyVariable1",
            dataType: node_opcua_1.DataType.Double,
            propertyOf: myObject,
            value: {
                dataType: node_opcua_1.DataType.Double,
                value: 36.0
            }
        });
        // variable can be updated this way - 1
        console.log(myVariable1.readValue().toString());
        myVariable1._dataValue.value.value = 60.0;
        // touchValue, ensure that value timestamp is updated and
        // change notification are propagated
        myVariable1.touchValue();
        console.log(myVariable1.readValue().toString());
        // variable can also be updated this way - 2
        myVariable1.setValueFromSource({ dataType: "Double", value: 12 });
        console.log(myVariable1.readValue().toString());
    })();
    await (async function technique2() {
        let value2 = 30;
        const myVariable2 = namespace.addVariable({
            browseName: "MyVariable2",
            dataType: node_opcua_1.DataType.Double,
            propertyOf: myObject,
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.Double,
                        value: value2,
                    });
                },
            },
        });
    })();
    await (async function technique3() {
        let value3 = 30;
        const myVariable3 = namespace.addVariable({
            browseName: "MyVariable3",
            dataType: node_opcua_1.DataType.Double,
            propertyOf: myObject,
            value: {
                get: function () {
                    return new node_opcua_1.Variant({
                        dataType: node_opcua_1.DataType.Double,
                        value: value3,
                    });
                },
                set: function (value) {
                    value3 = value.value;
                    return node_opcua_1.StatusCodes.Good;
                },
            },
        });
    })();
    await (async function technique4() {
        // variation2 async
        let dataValue4 = new node_opcua_1.DataValue({
            value: new node_opcua_1.Variant({
                dataType: node_opcua_1.DataType.Double,
                value: 40,
            }),
        });
        const myVariable4 = namespace.addVariable({
            browseName: "MyVariable4",
            dataType: node_opcua_1.DataType.Double,
            propertyOf: myObject,
            value: {
                timestamped_get: function () {
                    dataValue4.sourceTimestamp = new Date();
                    dataValue4.value.value += 1;
                    return dataValue4;
                },
            },
        });
    })();
    await (async function technique5() {
        let dataValue5 = new node_opcua_1.DataValue({
            value: new node_opcua_1.Variant({
                dataType: node_opcua_1.DataType.Double,
                value: 50,
            }),
        });
        const myVariable5 = namespace.addVariable({
            browseName: "MyVariable5",
            dataType: node_opcua_1.DataType.Double,
            propertyOf: myObject,
            value: {
                timestamped_get: function (callback) {
                    dataValue5.sourceTimestamp = new Date();
                    dataValue5.value.value += 1;
                    callback(null, dataValue5);
                },
            },
        });
    })();
    await (async function technique6() {
        const dataValue6 = new node_opcua_1.DataValue({
            value: new node_opcua_1.Variant({
                dataType: node_opcua_1.DataType.Double,
                value: 3.15,
            }),
        });
        function someLongOperation(callback) {
            setTimeout(callback, 100);
        }
        const option6 = {
            timestamped_get(callback) {
                someLongOperation(() => {
                    console.log("reading done!");
                    callback(null, dataValue6);
                });
            },
            timestamped_set(dataValue, callback) {
                someLongOperation(() => {
                    dataValue6.value = dataValue.value;
                    dataValue6.sourceTimestamp = dataValue.sourceTimestamp;
                    dataValue6.sourcePicoseconds = dataValue.sourcePicoseconds;
                    console.log("writing done!");
                    callback(null, node_opcua_1.StatusCodes.Good);
                });
            },
        };
        const variable6 = namespace.addVariable({
            browseName: "MyVariable6",
            description: "with an asynchronous setter and getter using callback functions",
            dataType: "Double",
            propertyOf: myObject,
            value: option6,
        });
        console.log("DataValue 6 before =", dataValue6.toString());
        const dataValueToWrite = new node_opcua_1.DataValue({
            value: { dataType: node_opcua_1.DataType.Double, value: 12345 },
        });
        await variable6.writeValue(null, dataValueToWrite);
        const dataValueVerif = await variable6.readValueAsync(node_opcua_1.SessionContext.defaultContext);
        console.log("DataValue 6 after =", dataValueVerif.toString());
    })();
    await (async function technique7() {
        const dataValue7 = new node_opcua_1.DataValue({
            value: new node_opcua_1.Variant({
                dataType: node_opcua_1.DataType.Double,
                value: 3.15,
            }),
        });
        async function simulateLongAsyncOperation(durationInMillisecond) {
            await new Promise((resolve) => setTimeout(resolve, durationInMillisecond));
        }
        /** the async/await getter function returning a promise */
        async function myAsyncGetFunc() {
            await simulateLongAsyncOperation(100);
            console.log("Reading variable 7 done");
            return dataValue7;
        }
        /** the async/await setter function returning a promise */
        async function myAsyncSetFunc(dataValue) {
            dataValue7.value = dataValue.value;
            dataValue7.sourceTimestamp = dataValue.sourceTimestamp;
            dataValue7.sourcePicoseconds = dataValue.sourcePicoseconds;
            await simulateLongAsyncOperation(100);
            console.log("writing variable 7 done");
            return node_opcua_1.StatusCodes.Good;
        }
        /** the adapter function for the getter */
        function getterWithCallback(callback) {
            myAsyncGetFunc()
                .then((dataValue) => callback(null, dataValue))
                .catch((err) => callback(err));
        }
        /** the adapter function for the setter */
        function setterWithCallback(dataValue, callback) {
            myAsyncSetFunc(dataValue)
                .then((statusCode) => callback(null, statusCode))
                .catch((err) => callback(err));
        }
        const option7 = {
            timestamped_get: getterWithCallback,
            timestamped_set: setterWithCallback,
        };
        const variable7 = namespace.addVariable({
            browseName: "MyVariable7",
            description: "with an asynchronous setter and getter using async/await and promise",
            dataType: "Double",
            propertyOf: myObject,
            value: option7,
        });
        console.log("DataValue 7 before =", dataValue7.toString());
        const dataValueToWrite = new node_opcua_1.DataValue({
            value: { dataType: node_opcua_1.DataType.Double, value: 12345 },
        });
        await variable7.writeValue(null, dataValueToWrite);
        const dataValueVerif = await variable7.readValueAsync(node_opcua_1.SessionContext.defaultContext);
        console.log("DataValue 7 after =", dataValueVerif.toString());
    })();
}
(async function main() {
    try {
        const server = new node_opcua_1.OPCUAServer({
            port: 26543,
            buildInfo: {
                manufacturerName: "MyCompany",
                productName: "MyFirstOPCUAServer",
                softwareVersion: "1.0.0"
            },
        });
        await server.start();
        await add_some_variables_variation2(server);
        const endpoint = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" server is ready on ", endpoint);
        console.log("CTRL+C to stop");
    }
    catch (err) {
        console.log(err);
        process.exit(-1);
    }
})();
//# sourceMappingURL=my_first_server_step4.js.map