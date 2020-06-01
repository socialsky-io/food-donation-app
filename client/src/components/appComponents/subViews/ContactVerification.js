import React from 'react';
import {Form, Input, InputNumber} from 'antd';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';

class ContactVerifyView extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['setFormItem']);
    }

    setFormItem(val, item) {
        this.props.setFormItem(val, item);
    }

    render() {
        const {getFieldDecorator} = this.props;

        return(
            <React.Fragment>
                <Form.Item label="Contact No">
                    {getFieldDecorator('mobileNo', {rules: [
                        {required: true, message: 'Contact no is required'},
                        {
                            required: true,
                            type: 'regexp',
                            pattern: new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/g),
                            message: 'Wrong format!'
                        }]
                    })(
                        <Input onChange={(e) => this.setFormItem(parseInt(e.target.value, 10), 'mobileNo')} />
                    )}
                </Form.Item>
                <Form.Item label="OTP">
                    {getFieldDecorator('otp', {rules: [{required: true, message: 'Please enter OTP'}]})(
                        <InputNumber onChange={(val) => this.setFormItem(val, 'otp')} />
                    )}
                </Form.Item>
            </React.Fragment>

        );

    }
}


ContactVerifyView.propTypes = {
    getFieldDecorator: PropTypes.func.isRequired,
    setFormItem: PropTypes.func.isRequired
};

const ContactVerifyViewForm = Form.create()(ContactVerifyView);


export default ContactVerifyViewForm;
