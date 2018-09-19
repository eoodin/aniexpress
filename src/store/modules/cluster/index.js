import {httpRoot} from "../../../server";

export const fetchCluster = () => {
    return dispatch => {
        return fetch(httpRoot + '/cluster').then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(r => {
            let date = r.headers.get('Date');
            date = date || new Date().toString();
            let offset = (new Date().getTime() - new Date(date).getTime());
            dispatch({type: 'SET_TIME_OFFSET', offset: offset});
            r.json().then(cluster => dispatch({type: 'SET_CLUSTER', info: cluster}));
        }).catch(e => {
            dispatch({type: 'CLEAR_CLUSTER_STATE'});
        });
    }
};

export const setClusterState = s => {
    return {type: 'SET_CLUSTER_STATE', state: s};
};

export default (cluster = {timeOffset: 0}, action) => {
    switch (action.type) {
        case 'SET_CLUSTER':
            return Object.assign({...cluster}, action.info);
        case 'CLEAR_CLUSTER_STATE':
            return {...cluster, state: null};
        case 'SET_TIME_OFFSET':
            return {...cluster, timeOffset: action.offset};
        case 'SET_CLUSTER_STATE':
            return {...cluster, state: action.state};
        default:
    }

    return cluster;
}
