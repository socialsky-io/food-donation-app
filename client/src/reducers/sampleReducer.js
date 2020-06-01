


import {CREATE_DONATION_REQUEST, FETCH_DONATION_REQUEST, API_SUFFIX, GET_DONARS_REQUEST_STATUS, FETCH_HELPING_HANDS,
    RAISE_NEED_REQUEST, FETCH_NEEDS,
    REMOVE_REQUEST, ADD_REQUEST, CONFIRM_REQUEST, CLEAR_RESPONSE_MESSAGE, FETCH_DONARS} from '../actions/actionTypes';

const {SUCCESS} = API_SUFFIX;

export default function sampleReducer(initialState = {}) {
    return (state = initialState, action) => {
        switch (action.type) {
            case CREATE_DONATION_REQUEST:
            case FETCH_DONATION_REQUEST:
            case GET_DONARS_REQUEST_STATUS:
            case FETCH_HELPING_HANDS:
            case CONFIRM_REQUEST:
            case RAISE_NEED_REQUEST:
            case FETCH_NEEDS:
            case FETCH_DONARS:
                return {
                    ...state,
                    loading:true
                };
            case CLEAR_RESPONSE_MESSAGE: {
                return {
                    ...state,
                    responseMessage: {},
                    areawiseHelpingHands: [],
                    areawiseDonars: [],
                    helpingHandResponse: {},
                    donarsResponse: {},
                    reqAdded: [],
                    reqRemoved: []
                };
            }
            case `${GET_DONARS_REQUEST_STATUS}${SUCCESS}`:
                var userRequests = action.payload;
                var responseMessage = {};
                if(action.payload.message) {
                    userRequests = [];
                    responseMessage = action.payload;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    userRequests: userRequests.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    responseMessage
                });
            case `${RAISE_NEED_REQUEST}${SUCCESS}`:
            case `${CREATE_DONATION_REQUEST}${SUCCESS}`:
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
                    reqAdded: [],
                    reqRemoved: []
                });
            case `${FETCH_DONATION_REQUEST}${SUCCESS}`: {
                let allProviders = [];
                let responseMessage = {};
                // let helpingHands = [];
                if(action.payload.message) {
                    responseMessage = action.payload;
                } else {
                    allProviders = action.payload;
                    // helpingHands = action.payload.helpingHands;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    // helpingHands: helpingHands,
                    allProviders: allProviders.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    responseMessage
                });
            }

            case `${FETCH_NEEDS}${SUCCESS}`: {
                let allNeeds = [];
                let responseMessage = {};
                // let helpingHands = [];
                if(action.payload.message) {
                    responseMessage = action.payload;
                } else {
                    allNeeds = action.payload;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    allNeeds: allNeeds.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    responseMessage
                });
            }

            case `${FETCH_HELPING_HANDS}${SUCCESS}`: {
                let areawiseHelpingHands = [];
                let helpingHandResponse = {};
                if(action.payload.message) {
                    helpingHandResponse = action.payload;
                } else {
                    areawiseHelpingHands = action.payload;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    areawiseHelpingHands: areawiseHelpingHands.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    helpingHandResponse
                });
            }
            case `${FETCH_DONARS}${SUCCESS}`: {
                let areawiseDonars = [];
                let donarsResponse = {};
                if(action.payload.message) {
                    donarsResponse = action.payload;
                } else {
                    areawiseDonars = action.payload;
                }
                return Object.assign({}, {
                    ...state,
                    loading: false,
                    areawiseDonars: areawiseDonars.map((data, index) => {
                        return {
                            key: data.key || index,
                            ...data
                        };
                    }),
                    donarsResponse
                });
            }
            case ADD_REQUEST: {
                const newAdded = [...state.reqAdded];
                let newRemoved = [...state.reqRemoved]
                const confirmedLocalData = state[action.payload.tableName].map((item, index) => {
                    if(item.key === action.payload.key) {
                        let itemFound = false;
                        newRemoved = newRemoved.filter((item1) => {
                            if(item1 === item._id) {
                                itemFound = true;
                            }
                            return item1 !== item._id;
                        });
                        if(!itemFound) {
                            newAdded.push(item._id);
                        }
                        return {...item, confirmedBy: action.payload.name};
                    }
                    return item;
                });

                return Object.assign({}, {
                    ...state,
                    [action.payload.tableName]: confirmedLocalData,
                    reqAdded: newAdded,
                    reqRemoved: newRemoved
                });
            }
            case REMOVE_REQUEST: {
                let newAdded = [...state.reqAdded];
                const newRemoved= [...state.reqRemoved];
                const updatedData = state[action.payload.tableName].map((item, index) => {
                    if(item.key === action.payload.key) {
                        let itemFound = false;
                        newAdded = newAdded.filter((item1) => {
                            if(item1 === item._id) {
                                itemFound = true;
                            }
                            return item1 !== item._id;
                        });
                        if(!itemFound) {
                            newRemoved.push(item._id);
                        }
                        return {...item, confirmedBy: null};

                    }
                    return item;
                });
                return Object.assign({}, {
                    ...state,
                    [action.payload.tableName]: updatedData,
                    reqRemoved: newRemoved,
                    reqAdded: newAdded
                });
            }
            default:
                return state;
        }
    };
}