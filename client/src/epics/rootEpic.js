import {combineEpics} from 'redux-observable';
import {ajax} from 'rxjs/ajax';
import foodAppEpic from './foodAppEpic';

const rootEpic = (...args) => combineEpics(
    foodAppEpic()
)(...args, {ajax});

export default rootEpic;