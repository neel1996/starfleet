import {
    CHANGE_SHIPNAME
} from './actionStore'

export default function reducer(state, action) {

    const {
        type,
        payload
    } = action

    switch(type){
        case CHANGE_SHIPNAME:
            return{
                ...state,
                shipName: payload
            }
        default:
            return{
                ...state
            }
    }

}