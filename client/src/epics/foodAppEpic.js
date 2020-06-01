import {map, switchMap, mergeMap, takeUntil} from 'rxjs/operators';
import {from as fromRxOperator} from 'rxjs';
import {camelCase, isEmpty} from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import {createProviderSuccessful, fetchProvidersSuccessful, confirmRequestSuccessful, fetchNeedsSuccessful,
    fetchDonarsSuccessful, confirmNeedRequestSuccessful, 
    getUserStatusSuccessful, getHelpingHandsSuccessful, raiseNeedSuccessful} from '../actions/sampleAction';
import {combineEpics} from 'redux-observable';

const API_NAME = 'foodAppApi';

const {CREATE_DONATION_REQUEST, FETCH_DONATION_REQUEST, FETCH_DONARS,
    RAISE_NEED_REQUEST, FETCH_NEEDS} = actionTypes;

const createProvideRequestEpic = (action$, state$, {apis}) => {
    const action = CREATE_DONATION_REQUEST;
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


const createNeedRequestEpic = (action$, state$, {apis}) => {
    const action = RAISE_NEED_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].createNeedRequestApi$(payload);
            }),
            map((result) => raiseNeedSuccessful(result))
        );
};


const fetchProviderRequestEpic = (action$, state$, {apis}) => {
    const action = FETCH_DONATION_REQUEST;
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
    const action = actionTypes.GET_DONARS_REQUEST_STATUS;
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

const fetchNeedsEpic = (action$, state$, {apis}) => {
    const action = FETCH_NEEDS;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].fetchNeedsApi$(payload);
            }),
            map((result) => fetchNeedsSuccessful(result))
        );
};

const fetchDonarsEpic = (action$, state$, {apis}) => {
    const action = FETCH_DONARS;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {payload} = metaData;
                return apis[API_NAME].fetchDonarsApi$(payload);
            }),
            map((result) => fetchDonarsSuccessful(result))
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
                const {reqAdded = [], reqRemoved= []} = sampleReducer;
                const {payload = {}} = metaData;
                const newpayload = {
                    confirmedIdList: reqAdded,
                    removedIdList: reqRemoved,
                    confirmedBy: payload.name,
                    helpingHandContactNo: payload.contactNo
                };
                return apis[API_NAME].confirmRequestApi$(newpayload);
            }),
            map((result) => confirmRequestSuccessful(result))
        );
};



const confirmNeedRequestEpic = (action$, state$, {apis}) => {
    const action = actionTypes.CONFIRM_NEED_REQUEST;
    return action$
        .ofType(action)
        .pipe(
            switchMap((metaData) => {
                const {value} = state$;
                const {sampleReducer} = value;
                const {reqAdded = [], reqRemoved= []} = sampleReducer;
                const {payload = {}} = metaData;
                const newpayload = {
                    confirmedIdList: reqAdded,
                    removedIdList: reqRemoved,
                    confirmedBy: payload.name,
                    donarsContactNo: payload.contactNo
                };
                return apis[API_NAME].confirmNeedRequestApi$(newpayload);
            }),
            map((result) => confirmNeedRequestSuccessful(result))
        );
};

// COMBINE ALL EPICS
const foodAppEpic = () => {
    return combineEpics(
        createProvideRequestEpic,
        fetchProviderRequestEpic,
        fetchUsersStatusEpic,
        fetchHelpingHandsEpic,
        confirmRequestEpic,
        createNeedRequestEpic,
        fetchNeedsEpic,
        fetchDonarsEpic,
        confirmNeedRequestEpic
    );
};

export default foodAppEpic;