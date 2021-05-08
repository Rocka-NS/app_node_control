const mongoose = require('mongoose');

// Client Schema

/* const DataTypeSchema = mongoose.Schema({
    dataType: String
});
const ValueSchema = mongoose.Schema({
    value: String
});
const ValueSchema1 = mongoose.Schema({
    value1: {
        value: ValueSchema,
        dataType: DataTypeSchema,
        //required: true
    },
});
const NodeIdSchema = mongoose.Schema({
    nodeId: {
        value1: ValueSchema1,
        name: String,
        
    },
});
const clientSchema = mongoose.Schema({
    endpoint: String,
    nodeId:{
    type: NodeIdSchema,
    //required: true
    },
    
},
{ collection : 'opcClient'});
 */
const clientSchema = mongoose.Schema({
    endpoint: String,
    nodeId:String,
    dataType: Boolean,
    value: String 
},
{ collection : 'opcClient'});
/* const clientSchema = mongoose.Schema({
    endpoint:{
        type: String,
        required: true
    },
    nodeID:{
        type: Object,
        required: false,
        value:{
            type: Object,
            required: false,
            dataType:{
                type: String,
                required: false
            },
            value:{
                type: Boolean,
                required: false
            },

        },
        name:{
            type: String,
            required: false
        },
    },
},
{ collection : 'opcClient'});
 */
const Client = module.exports = mongoose.model('Client', clientSchema);