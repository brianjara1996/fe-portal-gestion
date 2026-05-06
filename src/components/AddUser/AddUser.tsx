
import './AddUser.css';
import React, { useEffect, useState } from 'react';
import { Group, UserDto } from '../../services/model/model';
import { Button, Icon, Modal, ModalConfirmation, PasswordInput, Select, Spinner, Text, TextInput } from '@orbita-ui/core';
import Checker, { Check } from '../checker/Checker';
import { postUser } from '../../services/AdmService/AdmService';
import { getToken } from '../../services/SessionService/SessionService';

export interface AddUserConf {
    user?: UserDto;
    ous?: string[];
    groups?: Group[];
    onClose: Function;
    onSuccess: Function;
    bankCode?: string;
}

export enum ErrorsUsers {
    LDAP_USER_ALREADY_EXIST = "El usuario que intento agregar ya existe.",
    ERROR_USER_GROUPS = "Debe asignar al menos un grupo al usuario.",
    LDAP_WILL_NOT_PERFORM = "Hubo un error al crear el usuario, parametros invalidos.",
    GENERIC_ERROR = "No se pudo crear el usuario."
}

export const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/;

const AddUser = (config: AddUserConf) => {

    const [bankCode, setBankCode] = useState(config.user != undefined ? config.user.bankCode : '');
    const [userName, setUserName] = useState(config.user != undefined ? config.user.samAccountName : '');
    const [password, setPassword] = useState('');
    const [givenName, setGivenName] = useState('');
    const [sn, setSn] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [showModalGroups, setShowModalGroups] = useState(false);
    const [checks, setChecks] = useState<Check[]>();
    const [checksStr, setChecksStr] = useState<string[]>();

    const [inProcess, setInProcess] = useState(false);

    const [invalidUser, setInvalidUser] = useState(false);
    const [invalidGivenName, setInvalidGivenName] = useState(false);
    const [invalidSn, setInvalidSn] = useState(false);
    const [invalidPass, setInvalidPass] = useState(false);
    const [invalidPassText, setInvalidPassText] = useState('');
    const [btnPermisoError, setBtnPermisoError] = useState(false);
    const [invalidBankCode, setInvalidBankCode] = useState(false);

    const [errorMessage, setErrorMessage] = useState(false);
    const [errorMessageTxt, setErrorMessageTxt] = useState<ErrorsUsers | string>();

    useEffect(() => {

    }, [])

    function close() {
        setChecks(undefined);
        config.onClose();
    }

    function getOuList() {
        let ouLst = [];
        if (config != undefined && config.ous != undefined)
            config.ous.forEach(ou => {
                ouLst.push({
                    label: ou,
                    value: ou
                })
            });
        return ouLst;
    }

    function getGroupList() {
        let groupList = [];
        config.groups.forEach((m => {
            groupList.push(m.samaccountName);
        }));
        return groupList;
    }


    function createUser() {
        const ouLst = getOuList();
        if (!checkCreateUser(ouLst))
            return
        setInProcess(true);
        try {

            const token = getToken();
            if (token != null) {
                console.log(bankCode + "." + userName)

                const localBankCode = (bankCode == '' || bankCode == undefined) ? config.bankCode : bankCode
                postUser(token.bearer, localBankCode  + "." + userName, password, localBankCode, checksStr, givenName, sn)
                    .then((r) => {
                        if (r.status == 201) {
                            if (r.response.groupsFiled != undefined && r.response.groupsFiled.length > 0) {
                                setErrorMessage(true)
                                setErrorMessageTxt("Se creo el usuario, pero los siguientes grupos no se pudieron agregar " + r.response.groupsFiled.join(', '))
                            }
                            setUserName('')
                            setPassword('')
                            setGivenName('')
                            setSn('')
                            setConfirPassword('')
                            config.onSuccess()
                        } else if (r.status == 400) {
                            if (r.response.error.code == "LDAP-USER-ALREADY-EXIST") {
                                setErrMessage(ErrorsUsers.LDAP_USER_ALREADY_EXIST)
                            } else if (r.response.error.code == "LDAP-WILL-NOT-PERFORM") {
                                setErrMessage(ErrorsUsers.LDAP_WILL_NOT_PERFORM)
                            } else {
                                setErrMessage(ErrorsUsers.GENERIC_ERROR)
                            }
                        }
                    })
                    .finally(() => { setInProcess(false) })
            }

        } catch (error) {
            console.log(error)
            setInProcess(false)
        }
    }

    function setErrMessage(error: ErrorsUsers, extraInf: string = '') {
        setErrorMessage(true)
        setErrorMessageTxt(error)
    }

    function checkCreateUser(ouLst) {
        
        setInvalidUser(false)
        setInvalidGivenName(false)
        setInvalidSn(false)
        setInvalidPass(false)
        setBtnPermisoError(false)
        setInvalidBankCode(false)
        setErrorMessage(false)
        setErrorMessageTxt(undefined)

        if (ouLst.length > 1 && (bankCode == undefined || bankCode == '')) {
            setInvalidBankCode(true)
            return false;
        }
        if (userName == '') {
            setInvalidUser(true)
            return false;
        }
        if (givenName == '') {
            setInvalidGivenName(true)
            return false;
        }
        if (sn == '') {
            setInvalidSn(true)
            return false;
        }
        if (password.length < 8 || password == '') {
            setInvalidPass(true)
            setInvalidPassText('La contraseña debe tener una logitud mínima de 8 caracteres.')
            return false;
        }

        if (!regexPassword.test(password)) {
            setInvalidPass(true)
            setInvalidPassText('La contraseña debe contener al menos un dígito, una letra minúscula, una letra mayúscula, un carácter especial, ningún espacio y tener un minimo de 8 caracteres.')
            return false;
        }
        if (confirPassword != password) {
            setInvalidPass(true)
            setInvalidPassText('No coinciden las contraseñas.')
            return false;
        }
        if ((checksStr != undefined && checksStr.length == 0) || checksStr == undefined) {
            setBtnPermisoError(true)
            setErrMessage(ErrorsUsers.ERROR_USER_GROUPS)
            return false;
        }

        return true;
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    {getOuList().length > 1 &&
                        <div className="form-group col-md-2">
                            <Select
                                label="Banco"
                                fullWidth={true}
                                options={getOuList()}
                                defaultChecked={true}
                                onChange={(e) => setBankCode(e.target.value)}
                                disabled={getOuList().length == 1}
                                invalid={invalidBankCode}
                                errorText='Elija una opción.'

                            />
                        </div>
                    }
                    <div className="form-group col-md-2">
                        <TextInput
                            fullWidth={true}
                            label="Usuario"
                            placeholder=""
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoComplete='nope'
                            maxLength={10}
                            errorText={"Usuario inválido."}
                            invalid={invalidUser}

                        />
                    </div>

                    <div className="form-group col-md-2">
                        <TextInput
                            fullWidth={true}
                            label="Nombre"
                            placeholder=""
                            value={givenName}
                            onChange={(e) => setGivenName(e.target.value)}
                            maxLength={100}
                            invalid={invalidGivenName}
                            errorText={"Nombre inválido."}

                        />
                    </div>
                    <div className="form-group col-md-2">
                        <TextInput
                            fullWidth={true}
                            label="Apellido"
                            placeholder=""
                            value={sn}
                            onChange={(e) => setSn(e.target.value)}
                            maxLength={100}
                            invalid={invalidSn}
                            errorText={"Apellido inválido."}

                        />
                    </div>
                    <div className="form-group col-md-2">
                        <TextInput
                            fullWidth={true}
                            label="Contraseña"
                            placeholder=""
                            value={password}
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete='new-password'
                            errorText={invalidPassText}
                            invalid={invalidPass}
                            maxLength={25}
                        />
                    </div>

                    <div className="form-group col-md-2">
                        <TextInput
                            fullWidth={true}
                            label="Confirme contraseña"
                            placeholder=""
                            value={confirPassword}
                            type='password'
                            onChange={(e) => setConfirPassword(e.target.value)}
                            autoComplete='new-password'
                            invalid={invalidPass}
                            maxLength={25}
                        />
                    </div>
                    <div className="form-group col-md-1">
                        <Button color={btnPermisoError ? "destructive" : "primary"}
                            onClick={() => { setShowModalGroups(!showModalGroups) }}
                            style={{ marginTop: "34px" }}>

                            Permisos
                        </Button>
                    </div>

                </div>
                <div className="row">
                    <div className="d-flex flex-row-reverse">
                        <Button color="primary" size="small" variant="outline" disabled={inProcess} onClick={() => close()}>
                            Cancelar
                        </Button>
                        <Button color="primary" size="small" disabled={inProcess} onClick={() => createUser()}>
                            Agregar
                        </Button>
                        <div className='processingUser'>
                            {inProcess && <Spinner size='small' />}
                            {errorMessage &&
                                <span className="errorMessage">
                                    <Icon color="danger" name="WarningTriangleIcon" size="S" />
                                    {" " + errorMessageTxt}
                                </span>}
                        </div>
                    </div>

                </div>



                <Modal
                    onClose={() => {
                        setShowModalGroups(false)
                    }}
                    show={showModalGroups}
                >
                    <Text as="span">
                        Seleccione los grupos:
                    </Text>
                    <Checker callback={(checks) => { setChecksStr(checks); setShowModalGroups(false) }} listOptions={getGroupList()} currentChecks={checks} optionsMark={checksStr} ></Checker>

                </Modal>
            </div>
        </>
    );
}

export default AddUser;