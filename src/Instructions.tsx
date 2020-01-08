import React from 'react';

interface Props {
    closeInstructions: () => void;
    game: any;
}

const Instructions = ({ closeInstructions, game }: Props) => {
    return (
        <div className="instructions-container" onClick={closeInstructions}>
            <div className="instructions" onClick={event => event.stopPropagation()}>
                <pre>
                    <p>--- Regler ---</p>
                    <ol>
                        <li>Ingen forhåndsvisninger - ikke av resultatet eller ressurser!</li>
                        <li>Forbli i editoren</li>
                        <li>Det er ikke lov å bruke inspect eller andre målingsverktøy</li>
                        <li>Stopp å kode når tiden har gått ut</li>
                    </ol>
                    <p>
                        Vinneren er deltakeren som kommer nærmest den oppgitte skissen. Combo/poeng
                        kan være avgjørende ved veldig like resultater.
                    </p>
                    <p>Lykke til og viktigst av alt; ha det gøy!</p>

                    <p>--- Ressurser ---</p>
                    <ul>
                        <li>Tekster kan kopieres fra resultatet.</li>
                        {game.asset_texts.map((help: string, index: number) => {
                            return <li key={index}>{help}</li>;
                        })}
                    </ul>
                </pre>

                <br />

                <pre>
                    <p>--- HJELP 🤯 ---</p>

                    <div>Video brukes slik:</div>
                    <div>{`<video loop autoplay muted>`}</div>
                    <div>{`    <source src=<> type="video/mp4">`}</div>
                    <div>{`</video>`}</div>
                </pre>
            </div>
        </div>
    );
};

export default Instructions;
