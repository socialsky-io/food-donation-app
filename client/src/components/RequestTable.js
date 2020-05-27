import React from 'react';
import {Table, Modal, Button} from 'antd';
import PropTypes from 'prop-types';
import {bindAll, kebabCase, isEmpty, isEqual} from 'lodash';
import {connect} from 'react-redux';
import {addRequest, removeRequest} from '../actions/sampleAction';

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
            return {...item, date: item.date.split('T')[0]};
        });
        const defaultcolumns = [
            {
                title: 'Provider Name',
                dataIndex: 'providerName',
                key: 'providerName',
                sorter: (a, b) => a.providerName.localeCompare(b.providerName),
                sortDirections: ['ascend', 'descend']
            },
            {
                title: 'Serve count',
                dataIndex: 'serves',
                key: 'serves',
                sorter: (a, b) => a.serves - b.serves
            },
            {
                title: 'Serves As',
                dataIndex: 'serveAs',
                key: 'serveAs',
                sorter: (a, b) => a.serveAs.localeCompare(b.serveAs)
            },
            {
                title: 'Provider Address',
                dataIndex: 'providerAddress',
                key: 'providerAddress',
                sorter: (a, b) => a.serveAs.localeCompare(b.serveAs)
            },
            
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                sorter: (a, b) => new Date(a.date) - new Date(b.date)
            }, {
                title: 'Action',
                key: 'action',
                width: '100px',
                render: (text, record) => (
                    <div>
                        {record.confirmedBy === null && <Button onClick={() => this.confirmProvider(record)} >ADD</Button>}
                        {record.confirmedBy !== null && record.confirmedBy !== this.props.name && <span>Already Booked</span>}
                        {record.confirmedBy !== null && record.confirmedBy == this.props.name && <Button onClick={() => this.cancelProvider(record)} >Remove</Button>}
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
