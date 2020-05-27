import RxPhoenixHttp from './RxPhoenixHttp/RxPhoenixHttp';
import {simpleMapPipe} from './pipes.api';

const http = new RxPhoenixHttp();

// const baseURL = 'http://localhost:8070/api';
const baseURL = '/api';

const getQueryParams = (parameters) => {
    return Object.keys(parameters).map(paramKey => `${paramKey}=${parameters[paramKey]}`).join('&');
};

const createProviderRequestApi$ = (payload) => {
    return http.post(`${baseURL}/createProvideRequest`, payload).pipe(simpleMapPipe);
};


const fetchProviderRequestApi$ = (queryParam) => {
    queryParam = getQueryParams(queryParam);
    return http.get(`${baseURL}/fetchProviders`, queryParam).pipe(simpleMapPipe);
};

const confirmRequestApi$ = (payload) => {
    return http.post(`${baseURL}/confirmProvideRequest`, payload).pipe(simpleMapPipe);
};

export {
    createProviderRequestApi$,
    fetchProviderRequestApi$,
    confirmRequestApi$
};
