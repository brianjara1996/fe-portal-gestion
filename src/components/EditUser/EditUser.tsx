
import './EditUser.css';
import React, { useEffect, useState } from 'react';
import { Group, UserDto } from '../../services/model/model';
import Checker, { Check } from '../checker/Checker';
import { Button, Icon, Modal, Spinner, Text, TextInput } from '@orbita-ui/core';
import { getToken } from '../../services/SessionService/SessionService';
import { putUser } from '../../services/AdmService/AdmService';

export interface EditUserConf {
    user?: UserDto;
    groups?: Group[];
    onClose: Function;
    onSuccess: Function
}

export enum ErrorsUsers {
    ERROR_USER_GROUPS = "Debe asignar al menos un grupo al usuario.",
    LDAP_WILL_NOT_PERFORM = "Hubo un error al editar el usuario, parametros invalidos.",
    GENERIC_ERROR = "No se pudo editar el usuario."
}

export const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/;

const EditUser = (config: EditUserConf) => {

    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [showModalGroups, setShowModalGroups] = useState(false);
    const [checks, setChecks] = useState<Check[]>();
    const [checksStr, setChecksStr] = useState<string[]>();

    const [inProcess, setInProcess] = useState(false);

    const [invalidPass, setInvalidPass] = useState(false);
    const [invalidPassText, setInvalidPassText] = useState('');
    const [btnPermisoError, setBtnPermisoError] = useState(false);

    const [errorMessage, setErrorMessage] = useState(false);
    const [errorMessageTxt, setErrorMessageTxt] = useState<ErrorsUsers | string>();

    const [checkToRemove, setCheckToRemove] = useState<string[]>();
    const [checkToAdd, setCheckToAdd] = useState<string[]>();


    useEffect(() => {
        let checks = []
        config.user.memberOf.forEach(m => {
            checks.push(new Check(m.name, true))
        })
        setChecks(checks)
    }, [])

    function close() {
        setChecks(undefined);
        config.onClose();
    }

    function getGroupList() {
        let groupList = [];
        config.groups.forEach((m => {
            groupList.push(m.samaccountName);
        }));
        return groupList;
    }


    function editUser() {
        if (!checkEditUser())
            return
        setInProcess(true);
        try {

            const token = getToken();
            if (token != null) {
                putUser(token.bearer, config.user.samAccountName, password, undefined, config.user.bankCode, checkToAdd, checkToRemove)
                    .then((r) => {
                        if (r.status == 200) {
                            setPassword('')
                            setConfirPassword('')
                            config.onSuccess()
                        } else if (r.status >= 400) {
                            if (r.response != undefined && r.response.error.code == "LDAP-WILL-NOT-PERFORM") {
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

    function checkEditUser() {
        setInvalidPass(false)
        setBtnPermisoError(false)
        setErrorMessage(false)
        setErrorMessageTxt(undefined)

        if (password != '' || confirPassword != '') {
            if (password.length < 8) {
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
        }

        if ((checkToAdd != undefined || checkToRemove != undefined) && ((checksStr != undefined && checksStr.length == 0) || checksStr == undefined)) {
            setBtnPermisoError(true)
            setErrMessage(ErrorsUsers.ERROR_USER_GROUPS)
            return false;
        }

        return true;
    }

    const getUserNameEdit = () => {
        try {
            return config.user.samAccountName;
        } catch (error) {
            return '-';
        }
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <p>Editar usuario <strong className='strongClass'>{getUserNameEdit()}</strong> </p>
                </div>
                <div className="row">
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
                        <Button color="primary" size="small" disabled={inProcess} onClick={() => editUser()}>
                            Guardar
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
                    <Checker callback={(checks: string[], afterChecked: string[]) => {
                        setChecksStr(checks)
                        setShowModalGroups(false)

                        let checkToRemove: string[] = []
                        afterChecked.forEach(c => {
                            if (!checks.includes(c)) {
                                checkToRemove.push(c)
                            }
                        })
                        setCheckToRemove(checkToRemove)
                        let checkToAdd: string[] = []
                        checks.forEach(c => {
                            if (!afterChecked.includes(c)) {
                                checkToAdd.push(c)
                            }
                        })
                        setCheckToAdd(checkToAdd)

                    }} listOptions={getGroupList()} currentChecks={checks} optionsMark={checksStr} ></Checker>

                </Modal>
            </div>
        </>
    );
}

export default EditUser;