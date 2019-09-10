import React from "react";
import axios from "axios";
import { api } from "./App";

const Instructions = ({ closeInstructions }) => {
    const [ressurser, settRessurser] = React.useState([]);
    React.useEffect(() => {
        axios
            .get(`${api}/ressurser`)
            .then(response => settRessurser(response.data));
    }, []);

    return (
        <div className="instructions-container" onClick={closeInstructions}>
            <div
                className="instructions"
                onClick={event => event.stopPropagation()}
            >
                <pre>
                    <p>--- Regler ---</p>
                    <ol>
                        <li>
                            Ingen forhåndsvisninger - ikke av resultatet eller
                            ressurser!
                        </li>
                        <li>Forbli i editoren</li>
                        <li>Ingen målingsverktøy</li>
                        <li>Stopp å kode når tiden har gått ut</li>
                    </ol>
                    <p>Lykke til og viktigst av alt; ha det gøy!</p>
                    <p>--- Eksterne ressurser ---</p>
                    <p>Tekster</p>
                    <ul>
                        {ressurser.map(ressurs => (
                            <li>{`${ressurs.tittel}: ${ressurs.detaljer}`}</li>
                        ))}
                    </ul>
                    <p>Assets</p>
                    Enkelte assets er tilgjengelige gjennom server og andre
                    gjennom eksterne parter.
                    <ul>
                        <li>logo: "/assets/logo.svg"</li>
                        <li>
                            Abstrakt illustrasjon: "/assets/ping.mp4". Se
                            nederst for hint om video.
                        </li>
                        <li>
                            ping illustrasjon:
                            "https://ping.bekk.no/assets/ping-shape.png"
                        </li>
                    </ul>
                </pre>

                <pre>
                    <div>Video brukes slik:</div>
                    <div>{`<video loop=true autoplay=true>`}</div>
                    <div>{`    <source src=<> type="video/mp4">`}</div>
                    <div>{`</video>`}</div>
                </pre>
            </div>
        </div>
    );
};

export default Instructions;
