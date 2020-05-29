import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Empty, Select, Input, DatePicker, InputNumber, Switch} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase} from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import RequestTable from '../RequestTable';

const Option = Select.Option;

const timeSlots = {
    LUNCH: '11am - 1pm',
    SNACKS: '3pm - 6pm',
    DINNER: '7pm - 9pm'
};

const mockOTP = {
    '7588646483': '1234'
};

const countries = {
    'India': {
        'Maharashtra': {
            'Pune' : ['Yerwada', 'Kalyani Nagar', 'Vishrantwadi', 'Magarpatta', 'Hinjewadi'],
            'Mumbai': ['Andheri(E)', 'Andheri(w)', 'Goregaon', 'Juhu', 'Kurla', 'Sion']
        },
        'Madhya Pradesh': {
            'Ujjain': ['Mahakal Area', 'Mahananda', 'Rishi Nagar', 'Saket Nagar', '']
        }
    }
};

class SubComponent extends React.Component {
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
            showHelpingHand: false,
            searchMob: null
        };
        bindAll(this, ['createProvider', 'checkIfErrors', 'geolocate', 'changeScreen', 'initAutocomplete', 'fetchProviders', 'getUsersRequest', 'confirmProvideRequest']);
        this.autocomplete = null;
    }


    componentDidMount() {
        const googleMapScript = document.createElement('script');
        window.document.body.appendChild(googleMapScript);
        this.props.clearResponseMessage()
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

    createProvider() {
        const {form} = this.props;
        let {autocomplete, componentForm, showProvider, showHelpingHand, ...rest} = this.state;
    
        const errors = form.validateFields();

        // if(mockOTP[rest.mobileNo] != this.state.otp) {
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

        this.props.createProvider(data);
    }

    getUsersRequest() {
        const {searchMob} = this.state;
        if(searchMob) {
            this.props.getUserStatus({data: searchMob})
        }
    }

    fetchProviders() {
        const {selectedCountry, selectedState, selectedCity, selectedArea} = this.state;
        const rest = {
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
            areaName: selectedArea
        };
        this.props.fetchProviders(rest);
    }

    confirmProvideRequest() {
        const {auth} = this.props;
        this.props.confirmRequest({name: auth.user.username});
    }

    setFormItem(val, item) {
        this.setState({[item]: val});
    }

    changeScreen(screenName) {
        this.props.clearResponseMessage();
        this.setState({selectedCountry: '', selectedState: '', selectedCity: '', selectedArea: '', showScreen: screenName});
        this.props.form.setFields({country: '', city: '', state: '', area: ''});
    }

    render() {
        const {allProviders = [], responseMessage, reqAdded= [], auth, userRequests = []} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {autocomplete = {}, componentForm, showProvider, showHelpingHand, showScreen} = this.state;
        // const {ad = {}} = initData;
        const addressComps = autocomplete.getPlace && autocomplete.getPlace().address_components;
        const {isAuthenticated, user = {}} = auth;
        if(!(user && isAuthenticated)) {
            this.props.history.push('/login');
        }

        const {selectedCountry, selectedState, selectedCity, selectedArea} = this.state;

        const buttonProvider = classnames({
            'ant-btn ant-btn-link custom-links': true,
            'active': showScreen === 'provider'
        });
        const buttonHelpingHand = classnames({
            'ant-btn ant-btn-link custom-links': true,
            'active': showScreen === 'helpinghand'
        });
        const buttonUserStatus = classnames({
            'ant-btn ant-btn-link custom-links': true,
            'active': showScreen === 'searchStatus'
        });
        return (

            <div className="container">
                <Button className={buttonProvider} onClick={() => this.changeScreen('provider')}>I want to donate</Button>
                <Button className={buttonHelpingHand} onClick={() => this.changeScreen('helpinghand')}>Hepling hand</Button>
                <Button className={buttonUserStatus} onClick={() => this.changeScreen('searchStatus')}>Track Status</Button>

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

                {/* {showScreen === 'helpinghand' && <div>
                    <Button className="ant-btn ant-btn-primary" onClick={this.fetchProviders}>Raise Need</Button>
                    <Button className="ant-btn ant-btn-primary" onClick={this.fetchProviders}>Search Request</Button>   
                </div>} */}

                {(showScreen === 'provider' || showScreen === 'helpinghand') && <Form className="provider-form"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={{size: 'middle'}}
                    size={'middle'}>
                    <Form.Item name="select" label="Country">
                        {getFieldDecorator('country', {rules: [{required: true, message: 'Please select your country!'}]})(
                            <Select placeholder="Please select a country" onChange={(val) => this.setState({selectedCountry: val})}>
                                {Object.keys(countries).map((item) => <Option key={item} value={item}>{item}</Option>)}
                            </Select>
                        )}

                    </Form.Item>
                    {selectedCountry && <Form.Item name="select" label="State">
                        {getFieldDecorator('state', {rules: [{required: true, message: 'Please select your state!'}]})(
                            <Select placeholder="Please select a state" onChange={(val) => this.setState({selectedState: val})}>
                                {Object.keys(countries[selectedCountry]).map((item) => <Option key={item} value={item}>{item}</Option>)}
                            </Select>
                        )}
                    </Form.Item>}
                    {selectedState && <Form.Item name="select" label="City" hasFeedback
                        rules={[{required: true, message: 'Please select your city!'}]}>
                        <Select placeholder="Please select a city" onChange={(val) => this.setState({selectedCity: val})}>
                            {Object.keys(countries[selectedCountry][selectedState]).map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    </Form.Item>}
                    {selectedCity && <Form.Item name="select" label="Area" hasFeedback
                        rules={[{required: true, message: 'Please select your area!'}]}>
                        <Select placeholder="Please select area" onChange={(val) => this.setState({selectedArea: val})}>
                            {countries[selectedCountry][selectedState][selectedCity] &&
                            countries[selectedCountry][selectedState][selectedCity].map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    </Form.Item>}
                    {selectedArea && showScreen === 'provider' && <div>
                        <Form.Item name={['user', 'address']} label="Detail Address">
                            {getFieldDecorator('user_address', {rules: [{required: true, message: 'Address is required'}]})(
                                <Input.TextArea value={this.state.address} onChange={(e) => this.setFormItem(e.target.value, 'address')} />
                            )}
                        </Form.Item>
                        <Form.Item name={['user', 'address']} label="Food Description">
                            {getFieldDecorator('food_desc', {rules: [{required: true, message: 'Please add some food description'}]})(
                                <Input.TextArea value={this.state.foodDesc} onChange={(e) => this.setFormItem(e.target.value, 'foodDesc')} />
                            )}
                        </Form.Item>
                        <Form.Item label="Feed how many people">
                            {getFieldDecorator('serves', {rules: [{required: true, message: 'Approx people it can serve'}]})(
                                <InputNumber value={this.state.serves} onChange={(val) => this.setFormItem(val, 'serves')} />
                            )}
                        </Form.Item>
                        <Form.Item label="Mobile No">
                            {getFieldDecorator('mobileNo', {rules: [
                                {required: true, message: 'Mobile No'},
                                {
                                    required: true,
                                    type: 'regexp',
                                    pattern: new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/g),
                                    message: 'Wrong format!'
                                }]
                            })(
                                <Input value={this.state.mobileNo} onChange={(e) => this.setFormItem(parseInt(e.target.value, 10), 'mobileNo')} />
                            )}
                        </Form.Item>
                        <Form.Item label="OTP">
                            {getFieldDecorator('otp', {rules: [{required: true, message: 'Please enter OTP'}]})(
                                <InputNumber value={this.state.otp} onChange={(val) => this.setFormItem(val, 'otp')} />
                            )}
                        </Form.Item>
                        <Form.Item label="Date" >
                            {getFieldDecorator('serveOn', {rules: [{required: true, message: 'Please mention date you will provide food on'}]})(
                                <DatePicker
                                    disabledDate = {(current) => {
                                        // Can not select days before today and today
                                        return current && current < moment().endOf('day');
                                    }}
                                    value={this.state.serveOn} onChange={(val) => this.setFormItem(val, 'serveOn')} />
                            )}
                        </Form.Item>
                        <Form.Item label="Pickup time" >
                            {getFieldDecorator('serveas', {rules: [{required: true, message: 'Please enter pickup time'}]})(
                                // <Switch checkedChildren="LUNCH" unCheckedChildren="DINNER" checked={this.state.serveAs} onChange={(val) => this.setFormItem(val, 'serveAs')} />
                                <Select placeholder="Please select a state" value={this.state.serveAs} onChange={(val) => this.setFormItem(val, 'serveAs')} >
                                    {Object.keys(timeSlots).map((item) => <Option key={item} value={item}>{timeSlots[item]}</Option>)}
                                </Select>
                            )}
                        </Form.Item>
                        <Button className="ant-btn ant-btn-primary" onClick={this.createProvider}>Confirm</Button>
                    </div>}
                    {selectedArea && showScreen === 'helpinghand' && <div>
                        {auth.user.username && <div>
                            <Button className="ant-btn ant-btn-primary" onClick={this.fetchProviders}>Fetch Providers</Button>
                            <RequestTable name={auth.user.username}/>
                            {reqAdded.length > 0 && <Button className="ant-btn ant-btn-primary" onClick={this.confirmProvideRequest}>Confirm</Button>}
                        </div>}
                    </div>}

                    {responseMessage && <h3>{responseMessage.message}</h3>}
                </Form>}
            
                {showScreen === 'searchStatus' && <div className="search-status">
                    
                    <Button className="ant-btn ant-btn-primary" onClick={this.getUsersRequest}>Get Status</Button>
                    <InputNumber placeholder="Enter your mobile no" value={this.state.searchMob} onChange={(val) => this.setFormItem(val, 'searchMob')} />

                    {userRequests && userRequests.map((item) => <div key={item.date}>
                        {item.confirmedBy === null && <span>Awaiting confimation</span>}
                        {item.confirmedBy !== null && <span>Confirmed By {item.confirmedBy}</span>}
                    </div>)}
                    {responseMessage && <h3>{responseMessage.message}</h3>}
                </div>}
            
            </div>

        );
    }
}


SubComponent.propTypes = {
    auth: PropTypes.object.isRequired
};

const SubComponentForm = Form.create()(SubComponent);


export default SubComponentForm;
