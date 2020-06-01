import * as actions from './actionTypes';


export function addRequest(data) {
    return {type: actions.ADD_REQUEST, payload: data};
}

export function removeRequest(data) {
    return {type: actions.REMOVE_REQUEST, payload: data};
}
export function getUserStatus(data) {
    return {type: actions.GET_DONARS_REQUEST_STATUS, payload: data};
}

export function clearResponseMessage() {
    return {type: actions.CLEAR_RESPONSE_MESSAGE};
}




export function createProvider(data) {
    return {type: actions.CREATE_DONATION_REQUEST, payload: data};
}

export function raiseNeed(data) {
    return {type: actions.RAISE_NEED_REQUEST, payload: data};
}

export function fetchProviders(data) {
    return {type: actions.FETCH_DONATION_REQUEST, payload: data};
}

export function fetchHelpingHands(data) {
    return {type: actions.FETCH_HELPING_HANDS, payload: data};
}

export function fetchNeeds(data) {
    return {type: actions.FETCH_NEEDS, payload: data};
}

export function fetchDonars(data) {
    return {type: actions.FETCH_DONARS, payload: data};
}




export function confirmRequest(data) {
    return {type: actions.CONFIRM_REQUEST, payload: data};
}


export function confirmNeedRequest(data) {
    return {type: actions.CONFIRM_NEED_REQUEST, payload: data};
}



export function createProviderSuccessful(data) {
    return {type: `${actions.CREATE_DONATION_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function raiseNeedSuccessful(data) {
    return {type: `${actions.RAISE_NEED_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fetchProvidersSuccessful(data) {
    return {type: `${actions.FETCH_DONATION_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function confirmRequestSuccessful(data) {
    return {type: `${actions.CONFIRM_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function confirmNeedRequestSuccessful(data) {
    return {type: `${actions.CONFIRM_NEED_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}


export function getUserStatusSuccessful(data) {
    return {type: `${actions.GET_DONARS_REQUEST_STATUS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function getHelpingHandsSuccessful(data) {
    return {type: `${actions.FETCH_HELPING_HANDS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fetchNeedsSuccessful(data) {
    return {type: `${actions.FETCH_NEEDS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}
export function fetchDonarsSuccessful(data) {
    return {type: `${actions.FETCH_DONARS}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function requestFailed(payload) {
    return {type: actions.REQUEST_FAILED, payload: payload};
}
