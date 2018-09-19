import {httpRoot} from "../../../server";

export const fetchMeasures = from => {
    return dispatch => {
        let fetchUrl = httpRoot + '/measures';
        if (from && !isNaN(from)) {
            fetchUrl += '?from=' + from;
        }

        return fetch(fetchUrl).then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(r => r.json())
        .then(measures => {
              dispatch({type: 'SET_MEASURES', measures: measures});
        })
        .catch(e => {})
    }
};

export const appendMeasure = measure => {
    return {type: 'APPEND_MEASURE', measure: measure}
};

export default (measures = [], action) => {
    switch (action.type) {
        case 'SET_MEASURES':
            return action.measures;
        case 'APPEND_MEASURE':
            let mes = [...measures];
            mes.push(action.measure);
            return mes;
        default:
    }

    return measures;
}
