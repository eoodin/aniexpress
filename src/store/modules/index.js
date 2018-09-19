import { combineReducers } from 'redux';
import cluster from './cluster';
import nes from './nes';
import measures from './measures';


export default combineReducers({
    cluster,
    nes,
    measures
})