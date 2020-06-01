import React from 'react';
import {Form, Button, Select} from 'antd';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';

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

class AddressFormComponent extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['setFormItem']);
    }

    setFormItem(val, item) {
        this.props.setFormItem(val, item);
    }

    render() {
        const {getFieldDecorator, selectedCountry, selectedState, selectedCity, selectedArea} = this.props;

        return(
            <React.Fragment>
                <Form.Item name="select" label="Country">
                    {getFieldDecorator('country', {rules: [{required: true, message: 'Please select your country!'}]})(
                        <Select placeholder="Please select a country" onChange={(val) => this.setFormItem(val, 'selectedCountry')}>
                            {Object.keys(countries).map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    )}

                </Form.Item>
                <Form.Item name="select" label="State">
                    {getFieldDecorator('state', {rules: [{required: true, message: 'Please select your state!'}]})(
                        <Select placeholder="Please select a state"
                            disabled={selectedCountry ? false : true}
                            onChange={(val) => this.setFormItem(val, 'selectedState')}>
                            {selectedCountry && Object.keys(countries[selectedCountry]).map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item name="select" label="City">
                    {getFieldDecorator('city', {rules: [{required: true, message: 'Please select your city!'}]})(
                        <Select disabled={selectedState ? false : true} placeholder="Please select a city" onChange={(val) => this.setFormItem(val, 'selectedCity')}>
                            {selectedState && Object.keys(countries[selectedCountry][selectedState]).map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item name="select" label="Area">
                    {getFieldDecorator('area', {rules: [{required: true, message: 'Please select your area!'}]})(
                        <Select disabled={selectedCity ? false : true} placeholder="Please select area" onChange={(val) => this.setFormItem(val, 'selectedArea')}>
                            {selectedCity && countries[selectedCountry][selectedState][selectedCity] &&
                    countries[selectedCountry][selectedState][selectedCity].map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                    )}
                </Form.Item>
            </React.Fragment>);
    }
}


AddressFormComponent.propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
    fetchHelpingHands: PropTypes.func.isRequired,
    selectedCountry: PropTypes.string.isRequired,
    selectedState: PropTypes.string.isRequired,
    selectedCity: PropTypes.string.isRequired,
    selectedArea: PropTypes.string.isRequired,
    setFormItem: PropTypes.func.isRequired
};

const AddressFormComponentForm = Form.create()(AddressFormComponent);


export default AddressFormComponentForm;
