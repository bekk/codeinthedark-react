import * as React from 'react';
import './deltagerResultat.less';
import { api } from '../../api/api';

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

            <iframe src={`${api}/game/${gamepin}/${uuid}`} />
        </div>
    );
};

export default DeltagerResultat;
