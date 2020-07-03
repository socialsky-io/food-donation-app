import {connect} from 'react-redux';
import DonarsComponent from './DonarsComponent';
import {createProvider, fetchHelpingHands, fetchNeeds, getUserStatus, clearResponseMessage, 
    confirmNeedRequest} from '../../../actions/sampleAction';

import {withRouter} from 'react-router-dom';

const mapStateToProps = (state, ownProps) => {
    const {sampleReducer = {}} = state;
    const {allProviders = [], createStatus = {}, responseMessage, reqAdded, reqRemoved, loading, userRequests} = sampleReducer;
    
    return {
        createStatus,
        allProviders,
        responseMessage,
        userRequests,
        reqAdded,
        reqRemoved,
        loading,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createProvider: (payload) => {
            dispatch(createProvider(payload));
        },
        fetchNeeds: (payload) => {
            dispatch(fetchNeeds(payload));
        },
        fetchHelpingHands: (payload) => {
            dispatch(fetchHelpingHands(payload));
        },
        confirmNeedRequest: (payload) => {
            dispatch(confirmNeedRequest(payload));
        },
        getUserStatus: (payload) => {
            dispatch(getUserStatus(payload));
        },
        clearResponseMessage: () => {
            dispatch(clearResponseMessage());
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DonarsComponent));
export default connect(mapStateToProps, mapDispatchToProps)(DonarsComponent);
