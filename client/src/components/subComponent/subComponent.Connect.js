import {connect} from 'react-redux';
import SubComponent from './subComponent';
import {createProvider, fetchProviders, confirmRequest} from '../../actions/sampleAction';
import {withRouter} from 'react-router-dom';
const mapStateToProps = (state) => {
    const {sampleReducer = {}} = state;
    const {allProviders = [], createStatus = {}, responseMessage, reqAdded} = sampleReducer;
    
    return {
        createStatus,
        allProviders,
        responseMessage,
        reqAdded
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
        }
    };
};

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubComponent));
export default connect(mapStateToProps, mapDispatchToProps)(SubComponent);
