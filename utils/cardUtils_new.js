

module.exports = function () {
    
    var {
            Country,
            State,
            City,
            Areas,
            ProviderSchema
        } = require('../config/Model');
    
    var ObjectID = require('mongodb').ObjectID;
    var {timeSlots} = require('../config/appConfig');
    
    async function createLocationEntry(level, payload) {
        const {provider, areaName, city, state, country} = payload;
    
        var newAreas = await (new Areas({ name: areaName, providers: [provider]})).save();
        if(level === 'areas') {   
            return newAreas;
        }
        var newCity = await (new City({ name: city, areas: [newAreas]})).save();
        if(level === 'city') {
            return newCity; 
        }
        var newState = await (new State({ name: state, cities: [newCity]})).save();  
        if(level === 'state') {
            return newState;
        }
        var newCountry = await (new Country({ name: country, states: [newState]})).save();  
        return newCountry
    
        // switch(level) {
        //     case 'areas': var newAreas = await (new Areas({ name: areaName, providers: [provider]})).save();  
                          
        //     case 'city': var newCity = await (new City({ name: city, areas: [newAreas]})).save(); 
        //     case 'state': var newState = await (new State({ name: state, cities: [newCity]})).save(); 
        //     case 'country': var newCountry = await (new Country({ name: country, states: [newState]})).save();  
        // }
    }
    
    
    async function createProvideRequest(payload = {}) {
    
        let {areaName = '', city = '', state = '', country = '', ...rest} = payload;
        
        rest = {
            ...rest,
            confirmedBy: null
        }
        const provider = new ProviderSchema(rest);
        provider.save()
    
        let countryData = null, stateData = null, cityData = null, areaData = null;
        if(areaName && city && state && country) {        
            countryData = await Country.findOne({name: country}); 
            if(countryData) {
                stateData = await State.findOne({name: state}); 
                if(stateData) {
                    cityData = await City.findOne({name: city}); 
                    if(cityData) {
                        areaData = await Areas.findOne({name: areaName}); 
                        if(areaData) {
                            areaData.providers.push(provider);
                        } else {
                            areaData = await createLocationEntry('areas', {provider, areaName});
                            cityData.areas.push(areaData);
                        }
                        await areaData.save()
                    } else {
                        cityData = await createLocationEntry('city', {provider, areaName, city}); 
                        stateData.cities.push(cityData);
                    }
                    await cityData.save()
                } else {
                    stateData = await createLocationEntry('state', {provider, areaName, city, state});
                    countryData.states.push(stateData);
                }
                await stateData.save()
            } else {
                countryData = await createLocationEntry('country', {provider, areaName, city, state, country});
            }
            await countryData.save()
        } else {
            return 'Incomplete Data';
        }    
    }

    async function fetchUsersData(areaObj) {
         // To fetch country then get state thn city -- as state, city can be duplicate
         let providersInArea = await Areas.findOne({_id: areaObj._id}).populate('providers').exec();
         // let providersInArea = await Areas.findOne({name: areaName}).populate('providers').exec();
         // gameData = gameData.populate('areas').exec();
        if(providersInArea) {
            return providersInArea.providers;
        } else {
            return {message: 'No Provider found at this place', area: null}
        }
    }

    async function getDataByArea({country = 'India', state = 'Mahrashtra', city = 'Pune', areaName}) {
      
        if(country && state && city && areaName) {
            try {
                let provideCountry = await Country.findOne({name: country}).populate('states').exec();
                stateObj = provideCountry.states.find((item) => item.name === state);

                let provideState = await State.findOne({_id: stateObj._id}).populate('cities').exec();
                cityObj = provideState.cities.find((item) => item.name === city);

                let provideCity = await City.findOne({_id: cityObj._id}).populate('areas').exec();
                areaObj = provideCity.areas.find((item) => item.name === areaName);

                return areaObj;
            }
            catch {
                return {message: 'No Provider found at this place', area: null}
            }
        } else {
            return {message: 'Invalid Inputs'}
        }
    }


    async function confirmProvideRequest(reqBody) {
        const {confirmedBy = null, confirmedIdList = []} = reqBody;
        if(!confirmedBy) {
            return {message: 'Invalid Inputs'}
        }
        // confirmedIdList = confirmedIdList.map((item) => ObjectID(item));
        // Update only if confirmedBy is null
        try{
            const confirmedRequest = await ProviderSchema.updateOne(
                { _id: { $in: confirmedIdList } },
                { $set: { confirmedBy : confirmedBy } },
                {multi: true}
            );
            return {message: 'Request Confirmed! Please be available to collect'}
        } catch(err) {
            return {message: 'Unable to save info', error: err}
        }
     }
    

    async function fetchUserStatus({data}) {
        console.log(data)
        userData = await ProviderSchema.findOne({mobileNo: data}); 
        return userData;
    }
    return {
            createProvideRequest: createProvideRequest,
            getDataByArea: getDataByArea,
            fetchUsersData: fetchUsersData,
            confirmProvideRequest: confirmProvideRequest,
            fetchUserStatus: fetchUserStatus
        }   
    
    }