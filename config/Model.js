var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


    const providerRequestSchema = mongoose.Schema({
        // _id: mongoose.Schema.Types.ObjectId,
        date: Date,
        // time: TimeRanges,
        status: String,
        confirmedBy: String,
        serves: Number,
        helpingHandContactNo: Number,
        description: String,
        providerName: String,
        providerAddress: String,
        mobileNo: Number,
        serveAs: String
     });
    
    var ProviderSchema = mongoose.model("ProviderSchema", providerRequestSchema);


    const NeedSchema = mongoose.Schema({
        // _id: mongoose.Schema.Types.ObjectId,
        date: Date,
        status: String,
        confirmedBy: String,
        serves: Number,
        donarsContactNo: Number,
        helpingHandName: String,
        purpose: String,
        mobileNo: Number,
        serveAs: String
     });
    
    var NeedRequestSchema = mongoose.model("NeedRequestSchema", NeedSchema);



    const registeredHelpingHandSchema = mongoose.Schema({
        // _id: mongoose.Schema.Types.ObjectId,
        availableTimeSlot: String,
        workingDays: String,
        // time: TimeRanges,
        helpingHandContactNo: Number,
        serviceableArea: String,
        name: String
     });
    
    var HelpingHandRegisterSchema = mongoose.model("RegisteredHelpingHand", registeredHelpingHandSchema);

    const donarSchemaReg = mongoose.Schema({
        availableTimeSlot: String,
        workingDays: String,
        donarsContactNo: Number,
        serviceableArea: String,
        name: String
     });
    
    var DonarRegisterSchema = mongoose.model("DonarRegisterSchema", donarSchemaReg);


    var areasSchema = mongoose.Schema({
        name:   { type: String },
        providers: [ { type: ObjectId, ref: ProviderSchema } ],
        helpingHandRegistered: [ { type: ObjectId, ref: HelpingHandRegisterSchema } ],
        registeredDonars: [{ type: ObjectId, ref: DonarRegisterSchema }],
        raisedNeeds: [{ type: ObjectId, ref: NeedRequestSchema }]
    });
    
    var Areas = mongoose.model('Areas', areasSchema);


    var citySchema = mongoose.Schema({
        name: { type: String },
        areas: [{ type: ObjectId, ref: Areas }]
    });
    var City = mongoose.model('City', citySchema)

    var stateSchema = mongoose.Schema({
        name:   { type: String },
        cities: [ { type: ObjectId, ref: City } ]
    });
    var State = mongoose.model('State', stateSchema)


    var countrySchema = mongoose.Schema({
        name:   { type: String },
        states: [ { type: ObjectId, ref: State } ]
    });
    var Country = mongoose.model('Country', countrySchema)





module.exports = {
    Country,
    State,
    City,
    Areas,
    ProviderSchema,
    HelpingHandRegisterSchema,
    DonarRegisterSchema,
    NeedRequestSchema
}
