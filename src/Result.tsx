import * as React from 'react';
import { SanityGame } from './domain/types';

interface Props {
    game?: SanityGame;
}

const Result = ({ game }: Props) => {
    return (
        <>
            <div className="result__label">Ønsket resultat</div>
            <iframe className="result" srcDoc={game?.result_html} />
        </>
    );
};

export default Result;
