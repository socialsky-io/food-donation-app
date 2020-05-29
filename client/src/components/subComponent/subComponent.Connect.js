import {connect} from 'react-redux';
import SubComponent from './subComponent';
import {createProvider, fetchProviders, confirmRequest, getUserStatus, clearResponseMessage} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {allProviders = [], createStatus = {}, responseMessage, reqAdded, loading, userRequests} = sampleReducer;
    
    return {
        createStatus,
        allProviders,
        responseMessage,
        userRequests,
        reqAdded,
        loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createProvider: (payload) => {
            dispatch(createProvider(payload));
        },
        fetchProviders: (payload) => {
            dispatch(fetchProviders(payload));
        },
        confirmRequest: (payload) => {
            dispatch(confirmRequest(payload));
        },
        getUserStatus: (payload) => {
            dispatch(getUserStatus(payload));
        },
        clearResponseMessage: () => {
            dispatch(clearResponseMessage());
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubComponent));
export default connect(mapStateToProps, mapDispatchToProps)(SubComponent);
