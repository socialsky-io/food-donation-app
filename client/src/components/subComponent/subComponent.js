import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Button, Empty, Select, Input, DatePicker, InputNumber, Switch} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase} from 'lodash';
import classnames from 'classnames';

import RequestTable from '../RequestTable';

const Option = Select.Option;


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
            showProvider: false,
            showHelpingHand: false
        };
        bindAll(this, ['createProvider', 'checkIfErrors', 'geolocate', 'initAutocomplete', 'fetchProviders', 'confirmProvideRequest']);
        this.autocomplete = null;
    }


    componentDidMount() {
        // AIzaSyAgA67Hi7NMZ6g2Nhq1xXAxSEzS9dUKxOk
        const googleMapScript = document.createElement('script');
        googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAgA67Hi7NMZ6g2Nhq1xXAxSEzS9dUKxOk&libraries=places';
        // googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo&libraries=places`
        window.document.body.appendChild(googleMapScript);

        googleMapScript.addEventListener('load', () => {
            // this.googleMap = this.createGoogleMap()
            // this.marker = this.createMarker()
            this.initAutocomplete();
        });
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
        const errors = this.props.form.validateFields();
        const errorInfo = this.props.form.getFieldsError();
        if(this.checkIfErrors(errorInfo)) {
            return;
        }
        const {auth} = this.props;
        let {autocomplete, componentForm, showProvider, showHelpingHand, ...rest} = this.state;

        rest.serveAs = rest.serveAs ? 'LUNCH' : 'DINNER';
        rest.serveOn = rest.serveOn._d.toDateString();
        console.log('rest', rest);
        // const {selectedCountry: '', selectedState: '', selectedCity: '', selectedArea: '',
        // name, address, foodDesc, serves, serveOn, serveAs} = this.state;
        // rest = {
        //     selectedCountry: 'India',
        //     selectedState: 'Maharashtra',
        //     selectedCity: 'Pune',
        //     selectedArea: 'Magarpatta',
        //     name: 'Amol',
        //     address: 'xyz',
        //     foodDesc: 'khichadi',
        //     serves: 10,
        //     serveOn: '12/12/2020',
        //     serveAs: 'Lunch'
        // };
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
            country: rest.selectedCountry
        };

        this.props.createProvider(data);
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
        this.props.confirmRequest({name: auth.user.username});
    }

    setFormItem(val, item) {
        this.setState({[item]: val});
    }

    render() {
        const {allProviders = [], responseMessage, reqAdded= [], auth} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {autocomplete = {}, componentForm, showProvider, showHelpingHand} = this.state;
        // const {ad = {}} = initData;
        const addressComps = autocomplete.getPlace && autocomplete.getPlace().address_components;
        const {isAuthenticated, user = {}} = auth;
        if(!(user && isAuthenticated)) {
            this.props.history.push('/login');
        }

        const {selectedCountry, selectedState, selectedCity, selectedArea} = this.state;
        const buttonProvider = classnames({
            'ant-btn ant-btn-primary': true,
            'active': showProvider
        });
        const buttonHelpingHand = classnames({
            'ant-btn ant-btn-primary': true,
            'active': showHelpingHand
        });
        return (

            <div className="container">
                <Button className={buttonProvider} onClick={() => this.setState({showProvider: true, showHelpingHand: false})}>Provider</Button>
                <Button className={buttonHelpingHand} onClick={() => this.setState({showProvider: false, showHelpingHand: true})}>Hepling hand</Button>

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
                {(showProvider || showHelpingHand) && <Form className="provider-form"
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
                    {selectedArea && this.state.showProvider && <div>
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
                        <Form.Item label="Date" >
                            {getFieldDecorator('serveOn', {rules: [{required: true, message: 'Please mention date you will provide food on'}]})(
                                <DatePicker value={this.state.serveOn} onChange={(val) => this.setFormItem(val, 'serveOn')} />
                            )}
                        </Form.Item>
                        <Form.Item label="Serve As" >
                            {getFieldDecorator('serveas', {rules: [{required: true, message: 'Serve as'}]})(
                                // <Switch checkedChildren="LUNCH" unCheckedChildren="DINNER" checked={this.state.serveAs} onChange={(val) => this.setFormItem(val, 'serveAs')} />
                                <Select placeholder="Please select a state" value={this.state.serveAs} onChange={(val) => this.setFormItem(val, 'serveAs')} >
                                    {['LUNCH', 'SNACKS', 'DINNER'].map((item) => <Option key={item} value={item}>{item}</Option>)}
                                </Select>
                            )}
                        </Form.Item>
                        <Button className="ant-btn ant-btn-primary" onClick={this.createProvider}>Create Request</Button>
                    </div>}
                    {selectedArea && this.state.showHelpingHand && <div>
                        {auth.user.username && <div>
                            <Button className="ant-btn ant-btn-primary" onClick={this.fetchProviders}>Fetch Providers</Button>
                            <RequestTable name={auth.user.username}/>
                            {reqAdded.length > 0 && <Button className="ant-btn ant-btn-primary" onClick={this.confirmProvideRequest}>Confirm</Button>}
                        </div>}
                    </div>}

                    {responseMessage && <h3>{responseMessage.message}</h3>}
                </Form>}
            </div>

        );
    }
}


SubComponent.propTypes = {
    auth: PropTypes.object.isRequired
};

const SubComponentForm = Form.create()(SubComponent);


export default SubComponentForm;
