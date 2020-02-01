import axios from 'axios';
import throttle from 'lodash/throttle';

let api = 'https://codeinthedark-api.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:9000';
}

export const postParticipantData = throttle(({ content, uuid, gamepin }) => {
    if (uuid !== '') {
        axios.post(`${api}/participant/html`, {
            gamepin,
            content,
            uuid,
        });
    }
}, 5000);

export const createParticipant = (participantData: any) => {
    return axios.post(`${api}/participant/create`, {
        uuid: participantData.uuid,
        name: participantData.name,
        gamepin: participantData.gamepin,
    });
};
