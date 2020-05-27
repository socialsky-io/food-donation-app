import * as actions from './actionTypes';


export function addRequest(data) {
    return {type: actions.ADD_REQUEST, payload: data};
}

export function removeRequest(data) {
    return {type: actions.REMOVE_REQUEST, payload: data};
}


export function createProvider(data) {
    return {type: actions.CREATE_PROVIDER_REQUEST, payload: data};
}
export function fetchProviders(data) {
    return {type: actions.FETCH_PROVIDER_REQUEST, payload: data};
}

export function confirmRequest(data) {
    return {type: actions.CONFIRM_REQUEST, payload: data};
}


export function createProviderSuccessful(data) {
    return {type: `${actions.CREATE_PROVIDER_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function fetchProvidersSuccessful(data) {
    return {type: `${actions.FETCH_PROVIDER_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function confirmRequestSuccessful(data) {
    return {type: `${actions.CONFIRM_REQUEST}${actions.API_SUFFIX.SUCCESS}`, payload: data};
}

export function requestFailed(payload) {
    return {type: actions.REQUEST_FAILED, payload: payload};
}
