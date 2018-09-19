import {httpRoot} from "../../../server";

export const fetchNEs = () => {
    return dispatch => {
        return fetch(httpRoot + '/nes').then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(r => r.json())
        .then(nes => {
              dispatch({type: 'SET_NES', data: nes});
        })
        .catch(e => {})
    }
};

export default (nes = [], action) => {
    switch (action.type) {
        case 'SET_NES':
            return action.data;
        default:
    }

    return nes;
}
