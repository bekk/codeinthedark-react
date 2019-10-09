import * as React from "react";
import { getHtml } from "./api/api";

const Result = props => {
    const [resultHtml, setResultHtml] = React.useState("");

    React.useEffect(() => {
        console.log(props.match.params);
        if (props.match.params) {
            getHtml(
                props.match.params.arrangement,
                props.match.params.pulje
            ).then(response => {
                setResultHtml(response);
            });
        }
    }, [props.match.params.arrangement, props.match.params.pulje]);

    return (
        <>
            <div className="result__label">Resultat</div>
            <iframe className="result" srcDoc={resultHtml} />
        </>
    );
};

export default Result;
