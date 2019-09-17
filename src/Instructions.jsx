import React from "react";

const Instructions = ({ closeInstructions }) => {
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
                        <li>Det er ikke lov å bruke inspect eller andre målingsverktøy</li>
                        <li>Stopp å kode når tiden har gått ut</li>
                    </ol>
                    <p>Lykke til og viktigst av alt; ha det gøy!</p>

                    <p>--- Ressurser ---</p>
                    <ul>
                        <li>Tekster kan kopieres fra resultatet.</li>
                        <li>
                            logo (trenger ikke å ta hensyn til størrelse):
                            "http://codeinthedark-api.herokuapp.com/assets/logo.svg"
                        </li>
                        <li>
                            Abstrakt video (300 x 300px):
                            "http://codeinthedark-api.herokuapp.com/assets/ping_black.mp4".
                            Se under for hint om video.
                        </li>
                    </ul>
                </pre>

                <br />
                <pre>
                    <div>Video brukes slik:</div>
                    <div>{`<video loop autoplay>`}</div>
                    <div>{`    <source src=<> type="video/mp4">`}</div>
                    <div>{`</video>`}</div>
                </pre>
            </div>
        </div>
    );
};

export default Instructions;
