import * as React from 'react';
import './deltagerResultat.less';

interface IProps {
    gamepin: string;
    uuid: string;
}

const DeltagerResultat: React.SFC<IProps> = ({ gamepin, uuid }) => {
    return (
        <div className={'deltagerresultat'}>
            <div className={'deltagerresultat__tittel'}>
                <h1>Ditt resultat!</h1>
            </div>
            <p>
                Håper resultatet var like bra som forventet. Du kan gå <a href="/">hit</a> for å
                starte et nytt spill
            </p>

            <iframe src={`http://localhost:9000/game/${gamepin}/${uuid}`} />
        </div>
    );
};

export default DeltagerResultat;
