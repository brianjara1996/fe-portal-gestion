import { ESessionType } from "../services/SecurityService/SecurityService";

class LoginDto {
    domain: ESessionType;

    constructor(domain: ESessionType) {
        this.domain = domain;
    }
}

export default LoginDto;