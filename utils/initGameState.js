
var mongoose = require('mongoose');
var {
    Country,
    State,
    City,
    Areas,
    ProviderSchema
} = require('../config/Model');


module.exports = async function (providerData) {
    
 
    var initData = {
        name: 'India',
        states: [{
            name: 'MH',
            cities: [{
                name: 'Pune',
                areas: [{
                    name: 'KP',
                    providers: [{
                        date: new Date(),
                        status: 'Awaiting Confirmation',
                        confirmedBy: '',
                        serves: 0,
                        description: '',
                        providerName: '',
                        providerAddress: ''
                     }]
                }]
            }]
        }]
    };


    // var newProvider = await (new ProviderSchema({
    //     date: new Date(),
    //     status: 'Awaiting Confirmation',
    //     confirmedBy: '',
    //     serves: 0,
    //     description: '',
    //     providerName: '',
    //     providerAddress: ''
    // })).save()
    // console.log(newProvider);
    // var newAreas = await (new Areas({
    //     name: 'KP',
    //     providers: [newProvider]
    // })).save();
    // var newCity = await (new City({
    //     name: 'Pune',
    //     areas: [newAreas]
    // })).save();
    // var newState = await (new State({
    //     name: 'Maharashtra',
    //     cities: [newCity]
    // })).save();
    // var newCountry = await (new Country({
    //     name: 'India',
    //     states: [newState]
    // })).save();

    //  var newCountry = await (new Country(initData)).save();
    //  var newState = await (new State({})).save();
    //  var newCity = await (new City({})).save();
    //  var newAreas = await (new Areas({})).save();
    
    return {
        // newCountry,
        // newState,
        // newCity,
        // newAreas,
        // newProvider
    }
}