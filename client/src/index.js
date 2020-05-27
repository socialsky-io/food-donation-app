import React from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import moment from 'moment-timezone';
import {ConfigProvider} from 'antd';
import {IntlProvider} from 'react-intl';
import {Router} from 'react-router-dom';
import store, {persistor} from './store/configureStore';
// import {browserHistory, createBrowserHistory} from './history';
import {PersistGate} from 'redux-persist/integration/react';
import {Spin} from 'antd';
import en_GB from 'antd/es/locale-provider/en_GB';
import App from './app';
import 'bulma/css/bulma.min.css';
import styles from '../styles/food-app.less';
// import {ErrorBoundary} from './layout/errorPages/errorBoundary';
import Amplify from 'aws-amplify';
import config from './config';

moment.tz.setDefault('Europe/London');
const appStore = store;
Amplify.configure({
    Auth: {
        mandatorySignId: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    }
});

const Main = ({store}) => (
    <Provider store={store} className={styles}>
        {/* <ErrorBoundary> */}
        <PersistGate loading={<Spin/>} persistor={persistor}>
            <ConfigProvider locale={en_GB}>
                <IntlProvider locale="en">
                    {/* <Router> */}
                        <App />
                    {/* </Router> */}
                </IntlProvider>
            </ConfigProvider>
        </PersistGate>
        {/* </ErrorBoundary> */}
    </Provider>
);

Main.propTypes = {
    store: PropTypes.object.isRequired
};


render(<Main store={appStore} />, document.getElementById('app'));
