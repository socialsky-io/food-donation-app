import React from 'react';
import {Form, Button, InputNumber, Spin} from 'antd';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';

import HelpingHandComponent from './subComponents/HelpingHandComponent.Connect';
import DonarComponent from './subComponents/DonarsComponent.Connect';

import {createButtonClass} from '../../utils';

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
        bindAll(this, ['geolocate', 'createButtonClass', 'changeScreen', 'initAutocomplete']);
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

    changeScreen(screenName) {

        const {auth} = this.props;
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
        return createButtonClass(type, showScreen);
    }

    render() {
        const {auth, userRequests = [], responseMessage} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {autocomplete = {}, componentForm, showScreen} = this.state;
        // const {ad = {}} = initData;
        const addressComps = autocomplete.getPlace && autocomplete.getPlace().address_components;
        const {isAuthenticated, user = {}} = auth;

        const commonProps = {
            ...this.props,
            ...this.state,
            getFieldDecorator,
            isAuthenticated,
            user,
            showScreen
        };

        return (
            <div className="container">
                {!this.props.flow && <p className="control landing-page-btns">
                    <NavLink to="/app/donar">
                        <Button type="button" className="ant-btn ant-btn ant-btn-link custom-links" >I want to donate</Button>
                    </NavLink>
                    <NavLink to="/app/helpinghand">
                        <Button type="button" className="ant-btn ant-btn ant-btn-link custom-links" >Helping Hand</Button>
                    </NavLink>
                </p>}
                {this.props.flow === 'donar' && <DonarComponent
                    changeScreen={this.changeScreen}
                    createButtonClass={this.createButtonClass}
                    commonProps={commonProps} />}
                {this.props.flow === 'helpinghand' && <HelpingHandComponent
                    changeScreen={this.changeScreen}
                    createButtonClass={this.createButtonClass}
                    commonProps={commonProps} />}

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

AppComponent.defaultProps = {
    loading: false,
    userRequests: [],
    responseMessage: {},
    flow: ''
};

const AppComponentForm = Form.create()(AppComponent);


export default AppComponentForm;
