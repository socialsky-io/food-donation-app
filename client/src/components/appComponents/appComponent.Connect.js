import {connect} from 'react-redux';
import AppComponent from './appComponent';
import {createProvider, fetchProviders, confirmRequest, fetchHelpingHands, raiseNeed, fetchNeeds, fetchDonars,
    getUserStatus, clearResponseMessage} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {allProviders = [], createStatus = {}, responseMessage, reqAdded, reqRemoved, loading, userRequests} = sampleReducer;
    
    return {
        createStatus,
        allProviders,
        responseMessage,
        userRequests,
        reqAdded,
        reqRemoved,
        loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createProvider: (payload) => {
            dispatch(createProvider(payload));
        },
        raiseNeed: (payload) => {
            dispatch(raiseNeed(payload));
        },
        fetchProviders: (payload) => {
            dispatch(fetchProviders(payload));
        },
        fetchHelpingHands: (payload) => {
            dispatch(fetchHelpingHands(payload));
        },
        fetchNeeds: (payload) => {
            dispatch(fetchNeeds(payload));
        },
        fetchDonars: (payload) => {
            dispatch(fetchDonars(payload));
        },
        confirmRequest: (payload) => {
            dispatch(confirmRequest(payload));
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

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppComponent));
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
