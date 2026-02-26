import { Breadcrumb } from "@orbita-ui/core";
import DateToDay from "../dateToDay/DateToDay";
import './HeaderPage.css';

const HeaderPage = (props: { title: string, shortTitle: string, showPages: boolean }) => {
    return (
        <>
            <div className="row">
                <div className="header-information">
                    <div style={{ float: "right" }}><DateToDay></DateToDay></div>
                    <div className="page" style={{ visibility: ((props.showPages || false) ? 'visible' : 'hidden') }}>
                        <Breadcrumb
                            items={[
                                {
                                    href: '/home',
                                    label: 'Aplicaciones'
                                },
                                {
                                    label: props.shortTitle
                                }
                            ]}
                        />
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
