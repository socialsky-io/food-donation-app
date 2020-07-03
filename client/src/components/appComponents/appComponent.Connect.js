import {connect} from 'react-redux';
import AppComponent from './appComponent';
import {createProvider, fetchProviders, confirmRequest, fetchHelpingHands, raiseNeed, fetchNeeds, fetchDonars,
    getUserStatus, clearResponseMessage, confirmNeedRequest} from '../../actions/sampleAction';
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
        clearResponseMessage: () => {
            dispatch(clearResponseMessage());
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppComponent));
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
