import React from 'react';
import {Form, Button, InputNumber, Spin} from 'antd';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';
import classnames from 'classnames';

import RaiseNeedView from './subViews/RaiseNeedView';
import DonarView from './subViews/DonarComponent';
import HelpingHandView from './subViews/HelpingHandView';
import NeedAround from './subViews/NeedAround';

const mockOTP = {
    '7588646483': '1234'
};


class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autocomplete: undefined,
            componentForm: {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name',
                country: 'long_name',
                postal_code: 'short_name'
            },
            showScreen: '',
            searchMob: null
        };
        bindAll(this, ['createProvider', 'checkIfErrors', 'selectedArea', 'geolocate', 'createButtonClass',
            'changeScreen', 'initAutocomplete', 'setFormItem', 'fetchHelpingHands', 'raiseNeed',
            'fetchProviders', 'fetchDonars', 'fetchNeeds', 'getUsersRequest', 'createLocationPayload', 
            'confirmProvideRequest', 'confirmNeedRequest']);
        this.autocomplete = null;
    }


    componentDidMount() {
        const googleMapScript = document.createElement('script');
        window.document.body.appendChild(googleMapScript);
        this.props.clearResponseMessage();

        // googleMapScript.addEventListener('load', () => {
        //     // this.googleMap = this.createGoogleMap()
        //     // this.marker = this.createMarker()
        //     this.initAutocomplete();
        // });
    }

    initAutocomplete() {
        // Create the autocomplete object, restricting the search predictions to
        // geographical location types.
        let autocomplete = new window.google.maps.places.Autocomplete(
            document.getElementById('autocomplete'), {types: ['geocode']}
        );

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components.
        autocomplete.setFields(['address_component']);

        // When the user selects an address from the drop-down, populate the
        // address fields in the form.
        autocomplete.addListener('place_changed', () => {
            // this.setState({autocomplete: autocomplete.getPlace()})
            this.setState({autocomplete: autocomplete});
        });
    }

    geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new window.google.maps.Circle({center: geolocation, radius: position.coords.accuracy});

                if(this.state.autocomplete) {
                    this.state.autocomplete.setBounds(circle.getBounds());
                }
            });
        }
    }

    checkIfErrors(errorInfo = []) {
        let hasError = false;
        const fieldKeys = Object.keys(errorInfo);
        const totalFields = fieldKeys.length;
        for (let index = 0; index < totalFields; index++) {
            if (errorInfo[fieldKeys[index]]) {
                hasError = true;
                break;
            }
        }
        return hasError;
    }

    selectedArea(val) {
        this.setState({selectedArea: val});
        if(this.state.showScreen === 'helpinghand') {
            // this.fetchProviders();
        }
    }

    getUsersRequest() {
        const {searchMob} = this.state;
        if(searchMob) {
            this.props.getUserStatus({data: searchMob});
        }
    }

    createProvider() {
        const {form} = this.props;
        let {...rest} = this.state;

        const errors = form.validateFields();

        // if(!mockOTP[rest.mobileNo] || mockOTP[rest.mobileNo] != this.state.otp) {
        //     form.setFields({['otp']: {value: this.state.otp, errors: [new Error('Invalid OTP')]}});
        //     form.validateFields('otp');
        //     return;
        // }
        const errorInfo = form.getFieldsError();
        if(this.checkIfErrors(errorInfo)) {
            return;
        }

        rest.serveOn = rest.serveOn._d.toDateString();
        const {auth} = this.props;
        const data = {
            date: rest.serveOn,
            serves: rest.serves,
            description: rest.foodDesc,
            serveAs: rest.serveAs,
            providerName: auth.user.username,
            providerAddress: rest.address,
            areaName: rest.selectedArea,
            city: rest.selectedCity,
            state: rest.selectedState,
            mobileNo: rest.mobileNo,
            country: rest.selectedCountry
        };

        if(auth.user.pool) {
            localStorage.setItem(`${auth.user.pool.clientId}`, `${rest.selectedCountry}_${rest.selectedState}_${rest.selectedCity}_${rest.selectedArea}`);
        }
        this.props.createProvider(data);
    }

    raiseNeed() {
        const {form} = this.props;
        let {...rest} = this.state;

        const errors = form.validateFields();

        // if(!mockOTP[rest.mobileNo] || mockOTP[rest.mobileNo] != this.state.otp) {
        //     form.setFields({['otp']: {value: this.state.otp, errors: [new Error('Invalid OTP')]}});
        //     form.validateFields('otp');
        //     return;
        // }
        const errorInfo = form.getFieldsError();
        if(this.checkIfErrors(errorInfo)) {
            return;
        }

        rest.serveOn = rest.serveOn._d.toDateString();
        const {auth} = this.props;
        const data = {
            date: rest.serveOn,
            serves: rest.serves,
            purpose: rest.purpose,
            serveAs: rest.serveAs,
            helpingHandName: auth.user.username,
            areaName: rest.selectedArea,
            city: rest.selectedCity,
            state: rest.selectedState,
            country: rest.selectedCountry,
            mobileNo: rest.mobileNo
        };

        if(auth.user.pool) {
            localStorage.setItem(`${auth.user.pool.clientId}`, `${rest.selectedCountry}_${rest.selectedState}_${rest.selectedCity}_${rest.selectedArea}`);
        }
        this.props.raiseNeed(data);
    }

    createLocationPayload(){
        const {form} = this.props;
        const {selectedCountry, selectedState, selectedCity, selectedArea, mobileNo} = this.state;

        // if(!mockOTP[mobileNo] || mockOTP[mobileNo] != this.state.otp) {
        //     form.setFields({['otp']: {value: this.state.otp, errors: [new Error('Invalid OTP')]}});
        //     form.validateFields('otp');
        //     return;
        // }
        if(!(selectedCountry && selectedState && selectedCity && selectedArea)) {
            this.props.form.validateFields(['country', 'state', 'city', 'area']);
            return;
        }
        const rest = {
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
            areaName: selectedArea
        };
        return rest;
    }

    fetchHelpingHands() {
        const payload = this.createLocationPayload();
        this.props.fetchHelpingHands(payload);
    }

    fetchDonars() {
        const payload = this.createLocationPayload();
        this.props.fetchDonars(payload);
    }

    fetchProviders() {
        const payload = this.createLocationPayload();
        this.props.fetchProviders(payload);
    }

    fetchNeeds() {
        const payload = this.createLocationPayload();
        this.props.fetchNeeds(payload);
    }

    confirmProvideRequest() {
        const {auth} = this.props;
        this.props.confirmRequest({name: auth.user.username, contactNo: this.state.mobileNo});
    }

    confirmNeedRequest() {
        const {auth} = this.props;
        this.props.confirmNeedRequest({name: auth.user.username, contactNo: this.state.mobileNo});
    }

    setFormItem(val, item) {
        this.setState({[item]: val});
    }

    changeScreen(screenName) {

        const {auth} = this.props;
        const {selectedCountry} = this.state;
        const {isAuthenticated, user = {}} = auth;
        if(!(user && isAuthenticated)) {
            this.props.history.push('/login');
        }


        let locationData = {selectedCountry: '', selectedState: '', selectedCity: '', selectedArea: ''};
        /******* If past user get his location data *******/
        if(auth.user.pool && localStorage.getItem(`${auth.user.pool.clientId}`)) {
            const userData = localStorage.getItem(`${auth.user.pool.clientId}`).split('_');
            // let selectedCountry, selectedState, selectedCity, selectedArea;
            // [selectedCountry, selectedState, selectedCity, selectedArea] = userData;
            locationData.selectedArea = userData[3];
            locationData.selectedCity = userData[2];
            locationData.selectedState = userData[1];
            locationData.selectedCountry = userData[0];
        }

        this.props.clearResponseMessage();
        this.setState({...locationData, showScreen: screenName});

        var timer1 = setTimeout(() => {
            this.props.form.setFieldsValue({'country': locationData.selectedCountry,
                'city': locationData.selectedCity,
                'state': locationData.selectedState,
                'mobileNo': '',
                'area': locationData.selectedArea});

            if(this.state.selectedArea && this.state.showScreen === 'helpinghand') {
                // this.fetchProviders();
            }
            clearTimeout(timer1);
        }, 30);

    }

    createButtonClass(type) {
        const {showScreen} = this.state;
        return classnames({
            'ant-btn ant-btn-link custom-links': true,
            'active': showScreen === type
        });
    }

    render() {
        const {auth, userRequests = [], responseMessage} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {autocomplete = {}, componentForm, showScreen} = this.state;
        // const {ad = {}} = initData;
        const addressComps = autocomplete.getPlace && autocomplete.getPlace().address_components;
        const {isAuthenticated, user = {}} = auth;


        // const {selectedCountry, selectedState, selectedCity, selectedArea} = this.state;

        
        const commonProps = {
            ...this.props,
            ...this.state,
            getFieldDecorator,
            isAuthenticated,
            user
        };

        return (

            <div className="container">

                <div className="section-category">
                    <div className="section-title" onClick={this.create}>Donate Food</div>
                    <div>
                        <Button className={this.createButtonClass('provider')} onClick={() => this.changeScreen('provider')}>Donate</Button>
                        <Button className={this.createButtonClass('needAround')} onClick={() => this.changeScreen('needAround')}>Search Need</Button>
                        <Button className={this.createButtonClass('searchStatus')} onClick={() => this.changeScreen('searchStatus')}>Track Status</Button>
                        {/* <Button disabled className={this.createButtonClass('x')} onClick={() => this.changeScreen('registerDonar')}>Register as Donar</Button> */}
                    </div>
                </div>
                <div className="section-category">
                    <div className="section-title">Helping Hands</div>
                    <div>
                        <Button className={this.createButtonClass('raiseNeed')} onClick={() => this.changeScreen('raiseNeed')}>Raise Need</Button>
                        <Button className={this.createButtonClass('helpinghand')} onClick={() => this.changeScreen('helpinghand')}>Looking food</Button>
                        <Button className={this.createButtonClass('searchStatusHH')} onClick={() => this.changeScreen('searchStatusHH')}>Track Status</Button>
                        {/* <Button disabled className={this.createButtonClass('y')} onClick={() => this.changeScreen('registerHH')}>Register as Helping Hand</Button> */}
                    </div>
                </div>
                {/* <div>{ad.text}</div>
                    <div id="locationField">
                        <input id="autocomplete"
                            placeholder="Enter your address"
                            onFocus={this.geolocate}
                            type="text"/>
                    </div>

                    {addressComps && addressComps.map((item) => {
                        if(componentForm[item.types[0]]) {
                            return <div>{item[componentForm[item.types[0]]]}</div>;
                        }
                        return null;
                    })} */}

                {showScreen === 'provider' && <DonarView
                    {...commonProps}
                    createProvider={this.createProvider}
                    setFormItem={this.setFormItem}
                    fetchHelpingHands={this.fetchHelpingHands} />}
                {showScreen === 'helpinghand' && <HelpingHandView
                    {...commonProps}
                    setFormItem={this.setFormItem}
                    fetchProviders={this.fetchProviders}
                    confirmProvideRequest={this.confirmProvideRequest} />}
                {showScreen === 'raiseNeed' && <RaiseNeedView
                    {...commonProps}
                    raiseNeed={this.raiseNeed}
                    fetchDonars={this.fetchDonars}
                    setFormItem={this.setFormItem} />}

                {showScreen === 'needAround' && <NeedAround
                    {...commonProps}
                    confirmNeedRequest={this.confirmNeedRequest}
                    setFormItem={this.setFormItem}
                    fetchNeeds={this.fetchNeeds} />}

                {showScreen === 'searchStatus' && <div className="search-status">
                    <Button className="ant-btn ant-btn-primary" onClick={this.getUsersRequest}>Get Status</Button>
                    <InputNumber placeholder="Enter your mobile no" value={this.state.searchMob} onChange={(val) => this.setFormItem(val, 'searchMob')} />
                    {userRequests && userRequests.map((item) => <div key={item.date}>
                        {item.confirmedBy === null && <span>Awaiting confimation</span>}
                        {item.confirmedBy !== null && <span><b>{item.confirmedBy}</b> will pickup, <span>{item.description}</span>
                            <div>Contact No - {item.helpingHandContactNo}</div>
                        </span>}
                        <hr />
                    </div>)}
                    {(userRequests && userRequests.length > 0) && <div>Thank you for you contribution. You are doing a noble work.</div>}
                </div>}

                {showScreen === 'searchStatusHH' && <div className="search-status"> Track status for Helping hand. Work under progress </div>}

                {this.props.loading && <Spin />}
                {!this.props.loading && responseMessage && <h3>{responseMessage.message}</h3>}

            </div>

        );
    }
}


AppComponent.propTypes = {
    auth: PropTypes.object.isRequired,
    loading: PropTypes.boolean,
    userRequests: PropTypes.array,
    responseMessage: PropTypes.object
};

const AppComponentForm = Form.create()(AppComponent);


export default AppComponentForm;
