import axios from "axios";

let api = "https://codeinthedark-api.herokuapp.com";
if (process.env.NODE_ENV === "development") {
    api = "http://localhost:9000";
}

export const postParticipantData = (
    uuid,
    animationKey,
    exclamation,
    animateUpdate,
    contentUpdate,
    powerModeUpdate,
    streakUpdate,
    exclamationUpdate
) => {
    if (uuid !== "") {
        axios.post(`${api}/text`, {
            animate: animateUpdate,
            animationKey,
            content: contentUpdate,
            exclamation: exclamationUpdate ? exclamationUpdate : exclamation,
            name,
            uuid,
            powerMode: powerModeUpdate,
            streak: streakUpdate
        });
    }
};

export const getResultHtml = () => {
    return axios.get(`${api}/result`).then(response => response.data);
};
