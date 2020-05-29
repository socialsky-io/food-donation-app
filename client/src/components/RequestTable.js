import React from 'react';
import {Table, Modal, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import {addRequest, removeRequest} from '../actions/sampleAction';

const timeSlots = {
    LUNCH: '11am - 1pm',
    SNACKS: '3pm - 6pm',
    DINNER: '7pm - 9pm'
};

class RequestTable extends React.Component {

    constructor(props) {
        super(props);
    }

    confirmProvider(record) {
        this.props.addRequest({key: record.key, name: this.props.name});
    }
    
    cancelProvider(record) {
        this.props.removeRequest({key: record.key});
    }

    render() {

        let {allProviders = []} = this.props;

        if(isEmpty(allProviders)) {
            return null;
        }
        allProviders = allProviders.map((item) => {
            return {
                ...item, 
                date: item.date.split('T')[0],
                serveAs: timeSlots[item.serveAs]
            };
        });
        const defaultcolumns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: '150px',
                sorter: (a, b) => new Date(a.date) - new Date(b.date)
            },
            {
                title: 'Serve count',
                dataIndex: 'serves',
                key: 'serves',
                width: '100px',
                sorter: (a, b) => a.serves - b.serves
            },
            {
                title: 'Pickup Time',
                dataIndex: 'serveAs',
                key: 'serveAs',
                width: '130px',
                sorter: (a, b) => a.serveAs.localeCompare(b.serveAs)
            },
            {
                title: 'Provider Address',
                dataIndex: 'providerAddress',
                key: 'providerAddress',
                width: '250px',
                sorter: (a, b) => a.serveAs.localeCompare(b.serveAs)
            },
            {
                title: 'Provider Name',
                dataIndex: 'providerName',
                key: 'providerName',
                width: '150px',
                sorter: (a, b) => a.providerName.localeCompare(b.providerName),
                sortDirections: ['ascend', 'descend']
            },
            {
                title: 'Contact No',
                dataIndex: 'mobileNo',
                key: 'mobileNo',
                width: '150px'
            },
            {
                title: 'Action',
                key: 'action',
                width: '100px',
                render: (text, record) => (
                    <div>
                        {record.confirmedBy === null && <Button onClick={() => this.confirmProvider(record)} >Pickup</Button>}
                        {record.confirmedBy !== null && record.confirmedBy !== this.props.name && <span>{record.confirmedBy} will pickup</span>}
                        {record.confirmedBy !== null && record.confirmedBy == this.props.name && <Button onClick={() => this.cancelProvider(record)} >Cancel pickup</Button>}
                    </div>
                )
            }
        ];

        return(<div className="request-table">
            <Table
                bordered
                dataSource={allProviders}
                columns={defaultcolumns}
                pagination={allProviders.length > 10}/>
        </div>);

    }
}



const mapStateToProps = (state, ownProps) => {
    const {sampleReducer = {}} = state;
    const {allProviders = []} = sampleReducer;
    
    return {
        allProviders,
        name: ownProps.name
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addRequest: (payload) => {
            dispatch(addRequest(payload));
        },
        removeRequest: (payload) => {
            dispatch(removeRequest(payload));
        }
    };
};

RequestTable.propTypes = {};

RequestTable.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RequestTable);
