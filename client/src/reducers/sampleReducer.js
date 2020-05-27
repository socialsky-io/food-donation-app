


import {CREATE_PROVIDER_REQUEST, FETCH_PROVIDER_REQUEST, API_SUFFIX, REMOVE_REQUEST, ADD_REQUEST, CONFIRM_REQUEST} from '../actions/actionTypes';

const {SUCCESS} = API_SUFFIX;

export default function sampleReducer(initialState = {}) {
    return (state = initialState, action) => {
        switch (action.type) {
            case CREATE_PROVIDER_REQUEST:
            case FETCH_PROVIDER_REQUEST:
            case CONFIRM_REQUEST:
                return {
                    ...state,
                    loading:true
                };
            case `${CREATE_PROVIDER_REQUEST}${SUCCESS}`:
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    responseMessage: action.payload
                });
            case `${CONFIRM_REQUEST}${SUCCESS}`:
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    responseMessage: action.payload,
                    reqAdded: []
                });
            case `${FETCH_PROVIDER_REQUEST}${SUCCESS}`:
                var allProviders = action.payload;
                var responseMessage = {};
                if(action.payload.message) {
                    allProviders = [];
                    responseMessage = action.payload;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    allProviders: allProviders.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    responseMessage
                });


            case ADD_REQUEST: {
                const newAdded = [...state.reqAdded];
                const confirmedLocalData = state.allProviders.map((item, index) => {
                    if(item.key === action.payload.key) {
                        newAdded.push(item._id);
                        return {...item, confirmedBy: action.payload.name};
                    }
                    return item;
                });

                return Object.assign({}, {
                    ...state,
                    allProviders: confirmedLocalData,
                    reqAdded: newAdded
                });
            }
            case REMOVE_REQUEST: {
                let reqAdded= [...state.reqAdded];
                const updatedData = state.allProviders.map((item, index) => {
                    if(item.key === action.payload.key) {
                        reqAdded = reqAdded.filter((item1) => item1 !== item._id);
                        return {...item, confirmedBy: null};
                    }
                    return item;
                });
                return Object.assign({}, {
                    ...state,
                    allProviders: updatedData,
                    reqAdded: reqAdded
                });
            }
            default:
                return state;
        }
    };
}