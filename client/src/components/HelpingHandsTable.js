import React from 'react';
import {Table, Modal, Button, Spin} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';

class HelpingHandsTable extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {

        let {areawiseHelpingHands = [], helpingHandResponse, loading} = this.props;



        const defaultcolumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Available Time',
                dataIndex: 'availableTimeSlot',
                key: 'availableTimeSlot',
                width: '150px'
            },
            {
                title: 'Working Days',
                dataIndex: 'workingDays',
                key: 'workingDays',
                width: '100px'
            },
            {
                title: 'Contact Details',
                dataIndex: 'helpingHandContactNo',
                key: 'helpingHandContactNo',
                width: '130px'
            },
            {
                title: 'Serviceable Area',
                dataIndex: 'serviceableArea',
                key: 'serviceableArea',
                width: '250px'
            }
        ];

        return(<div className="helping-hand-table">
            {loading && <Spin />}
            {!loading && helpingHandResponse && <h3>{helpingHandResponse.message}</h3>}
            {!isEmpty(areawiseHelpingHands) && <Table
                bordered
                dataSource={areawiseHelpingHands}
                columns={defaultcolumns}
                pagination={areawiseHelpingHands.length > 10}/>}

        </div>);

    }
}



const mapStateToProps = (state, ownProps) => {
    const {sampleReducer = {}} = state;
    const {areawiseHelpingHands = [], helpingHandResponse = {}, loading} = sampleReducer;
    
    return {
        areawiseHelpingHands,
        loading,
        helpingHandResponse,
        name: ownProps.name
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

HelpingHandsTable.propTypes = {};

HelpingHandsTable.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HelpingHandsTable);
