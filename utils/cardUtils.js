

module.exports = function () {

// var {
//     newCountry,
//     newState,
//     newCity,
//     newAreas,
//     newProvider
//     } = require('../utils/initGameState');

var {
        Country,
        State,
        City,
        Areas,
        ProviderSchema
    } = require('../config/Model');

var ObjectID = require('mongodb').ObjectID;

async function createLocationEntry(level, payload) {
    const {provider, areaName, city, state, country} = payload;

    var newAreas = await (new Areas({ name: areaName, providers: [provider]})).save();
    if(level === 'areas') {   
        return
    }
    var newCity = await (new City({ name: city, areas: [newAreas]})).save();
    if(level === 'city') {
        return 
    }
    var newState = await (new State({ name: state, cities: [newCity]})).save();  
    if(level === 'state') {
        return 
    }
    var newCountry = await (new Country({ name: country, states: [newState]})).save();  


    // switch(level) {
    //     case 'areas': var newAreas = await (new Areas({ name: areaName, providers: [provider]})).save();  
                      
    //     case 'city': var newCity = await (new City({ name: city, areas: [newAreas]})).save(); 
    //     case 'state': var newState = await (new State({ name: state, cities: [newCity]})).save(); 
    //     case 'country': var newCountry = await (new Country({ name: country, states: [newState]})).save();  
    // }
    
}


async function createProvideRequest(payload = {}) {

    const {areaName = '', city = '', state = '', country = '', ...rest} = payload;
    
    const provider = new ProviderSchema(rest);
    provider.save()

    if(areaName && city && state && country) {        
        const countryData = await Country.findOne({name: country}); 
        if(countryData) {
            const stateData = await State.findOne({name: state}); 
            if(stateData) {
                const cityData = await City.findOne({name: city}); 
                if(cityData) {
                    const areaData = await Areas.findOne({name: areaName}); 
                    if(areaData) {
                        allAreasData.providers.push(provider);
                        await allAreasData.save()
                    } else {
                        await createLocationEntry('areas', {provider, areaName}); 
                    }
                } else {
                    await createLocationEntry('city', {provider, areaName, city}); 
                }
            } else {
                await createLocationEntry('state', {provider, areaName, city, state});
            }
        } else {
            await createLocationEntry('country', {provider, areaName, city, state, country});
        }
    } else {
        return 'Incomplete Data';
    }    
}

return {
        createProvideRequest: createProvideRequest
    }   

}