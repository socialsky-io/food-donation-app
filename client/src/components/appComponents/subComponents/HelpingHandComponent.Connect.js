import {connect} from 'react-redux';
import HelpingHandComp from './HelpingHandComponent';
import {fetchProviders, confirmRequest, raiseNeed, fetchDonars, clearResponseMessage} from '../../../actions/sampleAction';
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
        raiseNeed: (payload) => {
            dispatch(raiseNeed(payload));
        },
        fetchProviders: (payload) => {
            dispatch(fetchProviders(payload));
        },
        fetchDonars: (payload) => {
            dispatch(fetchDonars(payload));
        },
        confirmRequest: (payload) => {
            dispatch(confirmRequest(payload));
        },
        clearResponseMessage: () => {
            dispatch(clearResponseMessage());
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HelpingHandComp));
export default connect(mapStateToProps, mapDispatchToProps)(HelpingHandComp);
