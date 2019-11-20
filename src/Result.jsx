import * as React from 'react';
import { getHtml } from './api/api';

const Result = ({ match }) => {
    const [resultHtml, setResultHtml] = React.useState('');

    React.useEffect(() => {
        if (match.params) {
            getHtml(match.params.arrangement, match.params.pulje).then(response => {
                setResultHtml(response);
            });
        }
    }, [match.params.arrangement, match.params.pulje]);

    return (
        <>
            <div className="result__label">Resultat</div>
            <iframe className="result" srcDoc={resultHtml} />
        </>
    );
};

export default Result;
