
import BodyLogin from "../../components/body/bodyLogin/BodyLogin";
import { ESessionType } from "../../services/SecurityService/SecurityService";

const Login = () => {
    return (
        <BodyLogin domain={ESessionType.NET01} ></BodyLogin>
    );
}

export default Login;
