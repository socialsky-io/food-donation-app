import React from 'react';
import {Form, Button, Input, InputNumber, Select, DatePicker} from 'antd';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';
import moment from 'moment';

import AddressFormComponent from './AddressFormView';
import DonarsTable from '../../tables/DonarsTable';
import ContactVerifyView from './ContactVerification';

const Option = Select.Option;
const timeSlots = {
    LUNCH: '11am - 1pm',
    SNACKS: '3pm - 6pm',
    DINNER: '7pm - 9pm'
};


class RaiseNeedView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        bindAll(this, ['setFormItem']);
    }

    setFormItem(val, item) {
        this.props.setFormItem(val, item);
    }

    render() {

        const {auth, setFormItem, showScreen} = this.props;
        const {selectedCountry, selectedState, selectedCity, selectedArea, getFieldDecorator} = this.props;

        return(

            <div>
                <Form className="provider-form"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={{size: 'middle'}}
                    size={'middle'}>
                        
                    <AddressFormComponent
                        setFormItem={setFormItem}
                        selectedCountry={selectedCountry}
                        selectedState={selectedState}
                        selectedCity={selectedCity}
                        selectedArea={selectedArea}
                        getFieldDecorator={getFieldDecorator}
                        showScreen={showScreen}
                    />
                    <Button className="ant-btn ant-btn-primary" onClick={this.props.fetchDonars}>See Donars</Button>
                    <ContactVerifyView setFormItem={setFormItem} getFieldDecorator={getFieldDecorator} />

                    <Form.Item label="Feed how many people">
                        {getFieldDecorator('serves', {rules: [{required: true, message: 'Approx people it can serve'}]})(
                            <InputNumber value={this.props.serves} onChange={(val) => this.setFormItem(val, 'serves')} />
                        )}
                    </Form.Item>

                    <Form.Item label="Date" >
                        {getFieldDecorator('serveOn', {rules: [{required: true, message: 'Please mention date you will provide food on'}]})(
                            <DatePicker
                                disabledDate = {(current) => {
                                    // Can not select days before today and today
                                    return current && current < moment().endOf('day');
                                }}
                                onChange={(val) => this.setFormItem(val, 'serveOn')} />
                        )}
                    </Form.Item>
                    <Form.Item label="Pickup time" >
                        {getFieldDecorator('serveas', {rules: [{required: true, message: 'Please enter pickup time'}]})(
                            // <Switch checkedChildren="LUNCH" unCheckedChildren="DINNER" checked={this.props.serveAs} onChange={(val) => this.setFormItem(val, 'serveAs')} />
                            <Select placeholder="Please select a state" onChange={(val) => this.setFormItem(val, 'serveAs')} >
                                {Object.keys(timeSlots).map((item) => <Option key={item} value={item}>{timeSlots[item]}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item name={['user', 'address']} label="Purpose">
                        {getFieldDecorator('food_desc', {rules: [{required: true, message: 'More about need'}]})(
                            <Input.TextArea value={this.props.purpose} onChange={(e) => this.setFormItem(e.target.value, 'purpose')} />
                        )}
                    </Form.Item>
                    <Button className="ant-btn ant-btn-primary confirm-helping-hand-btn" onClick={this.props.raiseNeed}>Raise Need</Button> 
                </Form>
                <div>
                    <DonarsTable name={auth.user.username}/>
                </div>
            </div>);
    }
}


RaiseNeedView.propTypes = {
    auth: PropTypes.object.isRequired,
    showScreen: PropTypes.string.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    selectedCountry: PropTypes.string.isRequired,
    selectedState: PropTypes.string.isRequired,
    selectedCity: PropTypes.string.isRequired,
    selectedArea: PropTypes.string.isRequired,
    purpose:  PropTypes.string.isRequired,
    setFormItem: PropTypes.func.isRequired,

    fetchDonars: PropTypes.func.isRequired,
    raiseNeed: PropTypes.func.isRequired
};

const RaiseNeedViewForm = Form.create()(RaiseNeedView);

export default RaiseNeedViewForm;
