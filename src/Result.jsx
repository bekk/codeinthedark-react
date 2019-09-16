import * as React from "react";
import { getResultHtml } from "./api/api";

const Result = () => {
    const [resultHtml, setResultHtml] = React.useState("");

    React.useEffect(() => {
        getResultHtml().then(response => {
            setResultHtml(response);
        });
    }, []);

    return (
        <>
            <div className="result__label">Resultat</div>
            <iframe className="result" srcDoc={resultHtml} />
        </>
    );
};

export default Result;
