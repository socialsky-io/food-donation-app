import React from 'react';
import {Form, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll} from 'lodash';

import AddressFormComponent from './AddressFormView';
import RequestTable from '../../tables/DonationRequestTable';
import ContactVerifyView from './ContactVerification';

class HelpingHandView extends React.Component {
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

        const {auth, setFormItem, showScreen, reqAdded, reqRemoved, fetchProviders, confirmProvideRequest} = this.props;
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
                    <ContactVerifyView setFormItem={setFormItem} getFieldDecorator={getFieldDecorator} />
                </Form>
                {auth.user.username && <div>
                    <Button className="ant-btn ant-btn-primary" onClick={fetchProviders}>Get Donars Request</Button>
                    {selectedArea && <RequestTable name={auth.user.username}/>}
                    {(reqAdded.length > 0 || reqRemoved.length > 0) && <Button className="ant-btn ant-btn-primary confirm-helping-hand-btn" onClick={confirmProvideRequest}>Confirm Changes</Button>}
                </div>} 
            </div>);
    }
}


HelpingHandView.propTypes = {
    auth: PropTypes.object.isRequired,
    reqAdded: PropTypes.array.isRequired,
    reqRemoved: PropTypes.array.isRequired,
    showScreen: PropTypes.string.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    selectedCountry: PropTypes.string.isRequired,
    selectedState: PropTypes.string.isRequired,
    selectedCity: PropTypes.string.isRequired,
    selectedArea: PropTypes.string.isRequired,
    setFormItem: PropTypes.func.isRequired,
    fetchProviders: PropTypes.func.isRequired,
    confirmProvideRequest: PropTypes.func.isRequired
};

const HelpingHandViewForm = Form.create()(HelpingHandView);

export default HelpingHandViewForm;
