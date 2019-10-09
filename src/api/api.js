import axios from "axios";
import throttle from "lodash/throttle";

let api = "https://codeinthedark-api.herokuapp.com";
if (process.env.NODE_ENV === "development") {
    api = "http://localhost:9000";
}

export const postParticipantData = throttle(
    ({
        animate,
        animationKey,
        content,
        exclamation,
        name,
        powerMode,
        streak,
        uuid
    }) => {
        if (uuid !== "") {
            axios.post(`${api}/text`, {
                animate,
                animationKey,
                content,
                exclamation,
                name,
                uuid,
                powerMode,
                streak
            });
        }
    },
    500
);

export const getHtml = (arrangement, pulje) => {
    return axios
        .get(`${api}/${arrangement}/${pulje}`)
        .then(response => response.data);
};
