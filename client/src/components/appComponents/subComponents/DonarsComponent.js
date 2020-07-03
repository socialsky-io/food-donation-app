import React from 'react';
import {Button, InputNumber} from 'antd';

import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import classnames from 'classnames';


import {checkIfErrors} from '../../../utils';
import DonarView from '../subViews/DonarComponent';
import NeedAround from '../subViews/NeedAround';

const mockOTP = {
    '7588646483': '1234'
};


class DonarComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        bindAll(this, ['getUsersRequest', 'createProvider', 'fetchHelpingHands', 
            'setFormItem', 'createLocationPayload', 'fetchNeeds', 'confirmNeedRequest']);
    }

    componentDidMount() {
        this.props.clearResponseMessage();
    }

    setFormItem(val, item) {
        this.setState({[item]: val});
    }


    getUsersRequest() {
        const {searchMob} = this.state;
        if(searchMob) {
            this.props.getUserStatus({data: searchMob});
        }
    }

    createProvider() {
        const {commonProps} = this.props
        const {form} = commonProps;
        let {...rest} = this.state;

        const errors = form.validateFields();

        // if(!mockOTP[rest.mobileNo] || mockOTP[rest.mobileNo] != this.state.otp) {
        //     form.setFields({['otp']: {value: this.state.otp, errors: [new Error('Invalid OTP')]}});
        //     form.validateFields('otp');
        //     return;
        // }
        const errorInfo = form.getFieldsError();
        if(checkIfErrors(errorInfo)) {
            return;
        }

        rest.serveOn = rest.serveOn._d.toDateString();
        const {auth} = commonProps
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

    createLocationPayload(){
        const {commonProps} = this.props
        const {form} = commonProps;
        const {selectedCountry, selectedState, selectedCity, selectedArea, mobileNo} = this.state;

        // if(!mockOTP[mobileNo] || mockOTP[mobileNo] != this.state.otp) {
        //     form.setFields({['otp']: {value: this.state.otp, errors: [new Error('Invalid OTP')]}});
        //     form.validateFields('otp');
        //     return;
        // }
        if(!(selectedCountry && selectedState && selectedCity && selectedArea)) {
            form.validateFields(['country', 'state', 'city', 'area']);
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

    fetchNeeds() {
        const payload = this.createLocationPayload();
        this.props.fetchNeeds(payload);
    }


    confirmNeedRequest() {
        const {commonProps} = this.props
        const {auth} = commonProps;
        this.props.confirmNeedRequest({name: auth.user.username, contactNo: this.state.mobileNo});
    }


    render() {


        let {commonProps, userRequests, createButtonClass, changeScreen} = this.props;
        const {showScreen} = commonProps;
        // return(<div>Hello</div>)
        return(
            <div>
                <div className="btn-group">
                    <Button className={createButtonClass('provider')} onClick={() => changeScreen('provider')}>Donate</Button>
                    <Button className={createButtonClass('needAround')} onClick={() => changeScreen('needAround')}>Search Need</Button>
                    <Button className={createButtonClass('searchStatus')} onClick={() => changeScreen('searchStatus')}>Track Status</Button>
                    {/* <Button disabled className={createButtonClass('x')} onClick={() => changeScreen('registerDonar')}>Register as Donar</Button> */}
                </div>
                {showScreen === 'provider' && <DonarView
                    {...commonProps}
                    {...this.state}
                    createProvider={this.createProvider}
                    setFormItem={this.setFormItem}
                    fetchHelpingHands={this.fetchHelpingHands} />}
                
                {showScreen === 'needAround' && <NeedAround
                    {...commonProps}
                    {...this.state}
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
            </div>
        );

    }
}

DonarComponent.propTypes = {};

DonarComponent.defaultProps = {};

export default DonarComponent;
