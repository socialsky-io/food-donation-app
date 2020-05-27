import {combineReducers} from 'redux';
import {reducer as oidcReducer} from 'redux-oidc';
import sampleReducer from './sampleReducer';
import sampleReducerInitState from '../initialState/sampleReducerInitState';

import {enableBatching} from 'redux-batched-actions';

const rootReducer = combineReducers({
    oidcReducer,
    sampleReducer: sampleReducer(sampleReducerInitState, {})
});

export default enableBatching((rootReducer));