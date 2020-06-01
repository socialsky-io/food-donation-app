import React from 'react';
import {Table, Modal, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import {addRequest, removeRequest} from '../../actions/sampleAction';

const timeSlots = {
    LUNCH: '11am - 1pm',
    SNACKS: '3pm - 6pm',
    DINNER: '7pm - 9pm'
};

class NeedsTable extends React.Component {

    constructor(props) {
        super(props);
    }

    confirmProvider(record) {
        this.props.addRequest({key:  record.key, name: this.props.name, tableName: 'allNeeds'});
    }
    
    cancelProvider(record) {
        this.props.removeRequest({key: record.key, tableName: 'allNeeds'});
    }

    render() {

        let {allNeeds = []} = this.props;

        if(isEmpty(allNeeds)) {
            return null;
        }
        allNeeds = allNeeds.map((item) => {
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
                title: 'Helping Hand Name',
                dataIndex: 'helpingHandName',
                key: 'helpingHandName',
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
                title: 'Purpose',
                dataIndex: 'purpose',
                key: 'purpose',
                width: '150px'
            },
            {
                title: 'Pickup Action',
                key: 'action',
                width: '100px',
                render: (text, record) => (
                    <div>
                        {record.confirmedBy === null && <Button onClick={() => this.confirmProvider(record)} >Donate</Button>}
                        {record.confirmedBy !== null && record.confirmedBy !== this.props.name && <span>{record.confirmedBy} will donate</span>}
                        {record.confirmedBy !== null && record.confirmedBy == this.props.name && <Button onClick={() => this.cancelProvider(record)} >Cancel Donation</Button>}
                    </div>
                )
            }
        ];

        return(<div className="request-table">
            <Table
                bordered
                dataSource={allNeeds}
                columns={defaultcolumns}
                pagination={allNeeds.length > 10}/>
        </div>);

    }
}



const mapStateToProps = (state, ownProps) => {
    const {sampleReducer = {}} = state;
    const {allNeeds = []} = sampleReducer;
    
    return {
        allNeeds,
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

NeedsTable.propTypes = {};

NeedsTable.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NeedsTable);
