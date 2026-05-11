import DateToDay from "../dateToDay/DateToDay";
import './HeaderPage.css';

const HeaderPage = (props: { title: string, shortTitle: string, showPages: boolean }) => {
    return (
        <>
            <div className="row">
                <div className="header-information">
                    <div style={{ float: "right" }}><DateToDay></DateToDay></div>
                    <div className="page" style={{ visibility: ((props.showPages || false) ? 'visible' : 'hidden') }}>
                        <a href="/home">Aplicaciones</a>
                        <span style={{ margin: "0 8px" }}>{">"}</span>
                        <span>{props.shortTitle}</span>
                    </div>
                </div>
            </div>
            <div className="row" style={{ fontSize: "23px" }}>
                <b>{props.title}</b>
            </div>
        </>
    );
}

export default HeaderPage;
