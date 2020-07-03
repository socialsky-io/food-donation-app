import React from 'react';
import {Table, Modal, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import {addRequest, removeRequest} from '../../../actions/sampleAction';


import {checkIfErrors} from '../../../utils';
import RaiseNeedView from '../subViews/RaiseNeedView';
import HelpingHandView from '../subViews/HelpingHandView';


class HelpingHandComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        bindAll(this, ['raiseNeed', 'fetchProviders', 'fetchDonars', 'createLocationPayload', 
            'setFormItem', 'confirmProvideRequest']);
    }

    componentDidMount() {
        this.props.clearResponseMessage();
    }
   
    setFormItem(val, item) {
        this.setState({[item]: val});
    }

    raiseNeed() {
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
        const {auth} = commonProps;
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

    fetchDonars() {
        const payload = this.createLocationPayload();
        this.props.fetchDonars(payload);
    }

    fetchProviders() {
        const payload = this.createLocationPayload();
        this.props.fetchProviders(payload);
    }

    confirmProvideRequest() {
        const {auth} = this.props;
        this.props.confirmRequest({name: auth.user.username, contactNo: this.state.mobileNo});
    }

    render() {
        let {commonProps, createButtonClass, changeScreen} = this.props;
        const {showScreen} = commonProps;
       
        return (
            <div>
                <div className="btn-group">
                    <Button className={createButtonClass('raiseNeed')} onClick={() => changeScreen('raiseNeed')}>Raise Need</Button>
                    <Button className={createButtonClass('helpinghand')} onClick={() => changeScreen('helpinghand')}>Looking food</Button>
                    <Button className={createButtonClass('searchStatusHH')} onClick={() => changeScreen('searchStatusHH')}>Track Status</Button>
                    {/* <Button disabled className={createButtonClass('y')} onClick={() => changeScreen('registerHH')}>Register as Helping Hand</Button> */}
                </div>
                {showScreen === 'helpinghand' && <HelpingHandView
                    {...commonProps}
                    {...this.state}
                    setFormItem={this.setFormItem}
                    fetchProviders={this.fetchProviders}
                    confirmProvideRequest={this.confirmProvideRequest} />}
                {showScreen === 'raiseNeed' && <RaiseNeedView
                    {...commonProps}
                    {...this.state}
                    raiseNeed={this.raiseNeed}
                    fetchDonars={this.fetchDonars}
                    setFormItem={this.setFormItem} />}

                {showScreen === 'searchStatusHH' && <div className="search-status"> Track status for Helping hand. Work under progress </div>}
            </div>);
    }
}


HelpingHandComponent.propTypes = {};

HelpingHandComponent.defaultProps = {};

export default HelpingHandComponent;
