import {map, switchMap, mergeMap, takeUntil} from 'rxjs/operators';
import {from as fromRxOperator} from 'rxjs';
import {camelCase, isEmpty} from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import {createProviderSuccessful, fetchProvidersSuccessful, confirmRequestSuccessful, getUserStatusSuccessful, getHelpingHandsSuccessful} from '../actions/sampleAction';
import {combineEpics} from 'redux-observable';

const API_NAME = 'foodAppApi';

const {CREATE_PROVIDER_REQUEST, FETCH_PROVIDER_REQUEST} = actionTypes;

const createProvideRequestEpic = (action$, state$, {apis}) => {
    const action = CREATE_PROVIDER_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].createProviderRequestApi$(payload);
            }),
            map((result) => createProviderSuccessful(result))
        );
};

const fetchProviderRequestEpic = (action$, state$, {apis}) => {
    const action = FETCH_PROVIDER_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].fetchProviderRequestApi$(payload);
            }),
            map((result) => fetchProvidersSuccessful(result))
        );
};


const fetchUsersStatusEpic = (action$, state$, {apis}) => {
    const action = actionTypes.GET_USERS_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].fetchUsersStatusApi$(payload);
            }),
            map((result) => getUserStatusSuccessful(result))
        );
};


const fetchHelpingHandsEpic = (action$, state$, {apis}) => {
    const action = actionTypes.FETCH_HELPING_HANDS;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].fetchHelpingHandsApi$(payload);
            }),
            map((result) => getHelpingHandsSuccessful(result))
        );
};




const confirmRequestEpic = (action$, state$, {apis}) => {
    const action = actionTypes.CONFIRM_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {value} = state$;
                const {sampleReducer} = value;
                const {reqAdded = []} = sampleReducer;
                const {payload = {}} = metaData;
                const newpayload = {
                    confirmedIdList: reqAdded,
                    confirmedBy: payload.name,
                    helpingHandContactNo: payload.contactNo
                };
                return apis[API_NAME].confirmRequestApi$(newpayload);
            }),
            map((result) => confirmRequestSuccessful(result))
        );
};


// COMBINE ALL EPICS
const foodAppEpic = () => {
    return combineEpics(
        createProvideRequestEpic,
        fetchProviderRequestEpic,
        fetchUsersStatusEpic,
        fetchHelpingHandsEpic,
        confirmRequestEpic
    );
};

export default foodAppEpic;