


import classnames from 'classnames';

export const createButtonClass = function (type, showScreen) {
    return classnames({
        'ant-btn ant-btn-link custom-links': true,
        'active': showScreen === type
    });
};


export const checkIfErrors = function (errorInfo = []) {
    let hasError = false;
    const fieldKeys = Object.keys(errorInfo);
    const totalFields = fieldKeys.length;
    for (let index = 0; index < totalFields; index++) {
        if (errorInfo[fieldKeys[index]]) {
            hasError = true;
            break;
        }
    }
    return hasError;
};
