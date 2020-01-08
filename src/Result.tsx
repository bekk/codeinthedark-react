import * as React from 'react';

interface Props {
    game: any;
}

const Result = ({ game }: Props) => {
    return (
        <>
            <div className="result__label">Resultat</div>
            <iframe className="result" srcDoc={game ? game.result_html : ''} />
        </>
    );
};

export default Result;
