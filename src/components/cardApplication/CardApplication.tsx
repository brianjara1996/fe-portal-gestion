import './CardApplication.css';
import CardAppDto from '../../model/CardApplicationDto';
import { useState } from 'react';
import { addFavoriteApp, removeFavoriteApp } from '../../services/SessionService/SessionService';
import { Icon } from '@orbita-ui/core';

const APP_BASE_PATH = '/application';


function CardApplication(cardApplication: CardAppDto) {

    const [app, setApp] = useState(cardApplication);

    function favorite() {
        let localApp = new CardAppDto(app.title, app.appName, app.isFavorite);
        if (localApp.isFavorite)
            removeFavoriteApp(localApp.appName);
        else
            addFavoriteApp(localApp.appName);

        localApp.isFavorite = !localApp.isFavorite;
        setApp(localApp);
        cardApplication.onUpdate(setApp);
    }

    return (
        <div className="col-card-application">
            <div className="card-application alingn-center">
                <div className="app-block alingn-center">
                    <a href={APP_BASE_PATH + "/" + String(app.appName !== null ? app.appName : '').toLocaleLowerCase()}>

                        <Icon className="app-icon pointer"
                            color="neutralStrong"
                            name="GridIcon"
                            size="M"
                        />
                    </a>
                </div>
                <span className="app-text-body app-block alingn-center">
                    <a href={APP_BASE_PATH + "/" + String(app.appName !== null ? app.appName : '').toLocaleLowerCase()}>
                        {app.title}
                    </a>
                </span>
                <div className="app-block alingn-center">
                    <Icon
                        color={app.isFavorite ? "warning" : "neutralStrong"}
                        name={app.isFavorite ? "FavoriteFilledIcon" : "FavoriteIcon"}
                        size="S"
                        onClick={() => { favorite() }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CardApplication;