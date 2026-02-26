import NavBar from "../../components/navBar/NavBar";
import BodyHome from "../../components/body/bodyHome/BodyHome";
import { useEffect, useState } from "react";
import { getIfIsAdm, getUsername } from '../../services/SessionService/SessionService';

const Home = () => {

    const [username, setUsername] = useState('         ');
    const [isAdm, setIsAdm] = useState<boolean|undefined>(undefined);

    useEffect(() => {
        const user = getUsername();
        if (user != null)
            setUsername(user);
        getIfIsAdm(() => { setIsAdm(true) }, () => { setIsAdm(true) },()=>{ setIsAdm(false)})
    }, []);


    return (
        <>
            <NavBar username={username} isAdm={isAdm}></NavBar>
            <BodyHome isAdm={isAdm}></BodyHome>
        </>
    );
}

export default Home;
