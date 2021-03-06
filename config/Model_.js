var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


    const providerRequestSchema = mongoose.Schema({
        // _id: mongoose.Schema.Types.ObjectId,
        date: Date,
        time: TimeRanges,
        status: String,
        confirmedBy: String,
        helpingHandContactNo: Number,
        serves: Number,
        description: String,
        providerName: String,
        mobileNo: Number,
        providerAddress: String
     });
    
    var ProviderSchema = mongoose.model("ProviderSchema", providerRequestSchema);

     
    // var providerRequestsSchema = mongoose.Schema({
    //     providerToken: [ProviderSchema]
    // });
    
    // var ProviderRequests = mongoose.model("ProviderRequest", providerRequestsSchema);

    var areasSchema = mongoose.schema({
        name:   { type: String },
        providers: [ { type: ObjectId, ref: ProviderSchema } ]
    });
    var Areas = mongoose.model('Areas', areasSchema);


    var citySchema = mongoose.schema({
        name: { type: String },
        areas: [{ type: ObjectId, ref: Areas }]
    });
    var City = mongoose.model('City', citySchema)

    var stateSchema = mongoose.schema({
        name:   { type: String },
        cities: [ { type: ObjectId, ref: City } ]
    });
    var State = mongoose.model('State', stateSchema)


    var countrySchema = mongoose.schema({
        _id : String, // country
        // name:   { type: String },
        states: [ { type: ObjectId, ref: State } ]
    });
    var Country = mongoose.model('Country', countrySchema)





module.exports = {
    Country
}
