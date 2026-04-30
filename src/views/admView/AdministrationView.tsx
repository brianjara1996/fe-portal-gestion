import React, { SetStateAction, Suspense, useEffect, useRef, useState } from 'react';
import NavBar from '../../components/navBar/NavBar';
import HeaderPage from '../../components/headerPage/HeaderPage';
import Hr from '../../components/hr/Hr';
import { getIfIsAdm, getToken, getUsername } from '../../services/SessionService/SessionService';
import { CardCell, DoubleTextCell, Table, Badge, Button, Accordion, AccordionItem, Modal, ModalConfirmation, ToastPortal, Chip, PaginationState } from '@orbita-ui/core';
import { getGroups, getUsers, putUser } from '../../services/AdmService/AdmService';
import { GetLoginResponse, Group, Token, UserDto } from '../../services/model/model';
import AddUser, { AddUserConf } from '../../components/AddUser/AddUser';
import EditUser from '../../components/EditUser/EditUser';

const enum PageSize {
    PS_5 = 5,
    PS_10 = 10,
    PS_25 = 25,
    PS_50 = 50
}

const AdministrationView = () => {
    const [title, setTitle] = useState('Usuarios');
    const [shortTitle, setShortTitle] = useState('Administración');
    const [users, setUsers] = useState<UserDto[]>();
    const [usersFiltered, setUsersFiltered] = useState<UserDto[]>();
    const [groups, setGroups] = useState<Group[]>();

    const [loadUserTable, setLoadUserTable] = useState(false);
    const [loadGroupsTable, setLoadGroupsTable] = useState(false);

    const [totalUElements, setTotalUElements] = useState(undefined);
    const [pageUCount, setPageUCount] = useState<number>(undefined);
    const [pageUIndex, setPageUIndex] = useState<number>(undefined);
    const [pageUSize, setPageUSize] = useState<5 | 10 | 25 | 50>(5);

    const [totalGElements, setTotalGElements] = useState(0);
    const [pageGCount, setPageGCount] = useState(0);
    const [pageGIndex, setPageGIndex] = useState(0);
    const [pageGSize, setPageGSize] = useState<5 | 10 | 25 | 50>(5);

    const [visibleAddUser, setVisibleAddUser] = useState(false);
    const [visibleEditUser, setVisibleEditUser] = useState(false);
    const [userEditCreate, setUserEditCreate] = useState<UserDto>(undefined);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserDto>(undefined);
    const [usernameToDelete, setUsernameToDelete] = useState<string>('');

    const [showModalError, setShowModalError] = useState(false);

    const [userOu, setUserOu] = useState<string[]>();
    const [isRoot, setIsRoot] = useState(false);

    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [token, setToken] = useState<Token>();

    const [username, setUsername] = useState('         ');
    const [isAdm, setIsAdm] = useState(false);
    const [userBankCode, setUserBankCode] = useState('');

    function setTokenInfo(tokenInfo: GetLoginResponse) {
        setUserBankCode(tokenInfo.content.bankCode);
    }

    useEffect(() => {
        const user = getUsername();
        if (user != null)
            setUsername(user);
        setCurrentUserName(user);
        getIfIsAdm((tokenInfo) => { setIsAdm(true); setTokenInfo(tokenInfo); }, (tokenInfo) => { setIsRoot(true); setIsAdm(true); setTokenInfo(tokenInfo); });
        setToken(getToken());
    }, []);

    useEffect(() => {
        if (token != undefined) {
            loadListUser()


            getGroups(token.bearer).then(r => {
                if (r.status == 200) {
                    getIfIsAdm((tokenInfo) => {
                        let groupsFiltered: Group[] = []
                        r.response.groups.forEach(g => {
                            if (!g.samaccountName.toLocaleLowerCase().includes('admin'))
                                groupsFiltered.push(g)
                        });
                        setGroups(groupsFiltered);
                        setTokenInfo(tokenInfo);
                    }, (tokenInfo) => {
                        setGroups(r.response.groups);
                        setTotalGElements(r.response.groups.length);
                        setPageGCount(Math.ceil(r.response.groups.length / pageUSize));
                        setLoadGroupsTable(true);
                        setTokenInfo(tokenInfo);
                    }, () => {
                        setGroups(r.response.groups);
                    })

                }
            });
        }
    }, [token])

    const portalRef = useRef<{
        addToast: ({ }) => void;
    }>();

    function notification(title: string, subtitle: string, type: 'info' | 'error' | 'neutral' | 'success', duration: number = 3000) {
        portalRef.current &&
            portalRef.current.addToast({
                autoHideDuration: duration,
                title: title,
                subtitle: subtitle,
                variant: type,
                dismissIconOnClick: () => console.log('Acción cross icon'),
                withDismissIcon: true,
                buttonPosition: 'bottomAction'
            })
    }

    function askDeleteUser(user: UserDto) {
        setUsernameToDelete(user.samAccountName)
        setUserToDelete(user);
        setShowModalDelete(true);
    }

    function loadListUser() {
        getUsers(token.bearer).then(r => {
            if (r.status == 200) {
                let userLst = []
                r.response.users.forEach(u => {
                    if (u.accountExpires != 1)
                        userLst.push(u)
                });
                setUsers(userLst);

                userPagination({ pageIndex: pageUIndex, pageSize: pageUSize }, userLst)
                setLoadUserTable(true);
                let ous = [];
                r.response.ous.forEach(ou => {
                    ous.push(ou.bankCode);
                });
                setUserOu(ous);
            }
        });
    }

    function cancelDelete() {
        setShowModalDelete(false)
        setUserToDelete(undefined)
    }

    function deleteUser() {
        try {
            const token = getToken();
            if (token != null) {
                putUser(token.bearer, userToDelete.samAccountName, null, false, userToDelete.bankCode).then((r) => {
                    if (r.status == 200) {
                        notification("Usuario eliminado", '', "info");
                    } else {
                        notification("Error", "No se pudo eliminar el usuario " + userToDelete.samAccountName, "error");
                    }
                }).catch(() => {
                    notification("Error", "No se pudo eliminar el usuario " + userToDelete.samAccountName, "error");
                }).finally(() => {
                    setShowModalDelete(false);
                    loadListUser()
                });
            } else {
                notification("Error", "No se pudo eliminar el usuario " + userToDelete.samAccountName, "error");
            }
        } catch (error) {
            notification("Error", "No se pudo eliminar el usuario " + userToDelete.samAccountName, "error");
        }
    }

    function getPagination(value: number): PageSize {
        if (value > 5 && value <= 10)
            return PageSize.PS_10
        else if (value > 10 && value <= 25)
            return PageSize.PS_25
        else if (value > 25 && value <= 50)
            return PageSize.PS_50
        else
            return PageSize.PS_5
    }

    function countPermission(users: UserDto[]): number {
        let counter = 0;
        users.forEach(u => {
            counter += u.memberOf.length
        });
        return counter
    }

    function userPagination(pagination: PaginationState, usersLst: UserDto[]) {
        let dataDiff = false;
        if (usersLst != undefined && users != undefined && (usersLst.length != users.length || countPermission(usersLst) != countPermission(users)))
            dataDiff = true;

        const userToFilter = usersLst != undefined ? usersLst : users;
        let reloadByChange = false;
        if (totalUElements == undefined || dataDiff)
            setTotalUElements(userToFilter.length);
        if (pageUCount == undefined || dataDiff || (pageUCount != undefined && pageUSize != pagination.pageSize)) {
            if (pageUCount != undefined)
                reloadByChange = true
            setPageUCount(Math.ceil(userToFilter.length / pagination.pageSize))
        }

        if (userToFilter != undefined && (dataDiff || reloadByChange || pageUIndex == undefined || pagination.pageIndex != pageUIndex)) {

            let usersFilter = []
            setPageUIndex(pagination.pageIndex | 0)
            setPageUSize(getPagination(pagination.pageSize))
            const indexStart = pagination.pageSize * (pagination.pageIndex | 0)
            for (let i = indexStart; i < indexStart + pagination.pageSize; i++) {
                if (i >= userToFilter.length)
                    break;
                usersFilter.push(userToFilter[i]);
            }
            setUsersFiltered(usersFilter)
        }

    }

    return (
        <>
            <ToastPortal ref={portalRef} />
            <div className="container h-100 top">
                <NavBar username={username} isAdm={isAdm}></NavBar>
                <HeaderPage title={title} shortTitle={shortTitle} showPages={true}></HeaderPage>
                <Hr></Hr>

                <div className="container">
                    {!visibleAddUser && <div className="row">
                        <div className="d-flex flex-row-reverse">
                            <div className="p-2">
                                <Button icon='AddIcon' size="small" onClick={() => { setUserEditCreate(undefined); setVisibleAddUser(true); setVisibleEditUser(false) }}>Agregar</Button>
                            </div>
                        </div>
                    </div>}
                    <div className='row'>
                        {visibleAddUser &&
                            <AddUser
                                bankCode={userBankCode}
                                user={userEditCreate}
                                ous={userOu}
                                groups={groups}
                                onClose={() => { setUserEditCreate(undefined); setVisibleAddUser(false) }}
                                onSuccess={() => { setUserEditCreate(undefined); loadListUser() }}></AddUser>}
                        {visibleEditUser &&
                            <EditUser
                                user={userEditCreate}
                                groups={groups}
                                onClose={() => { setUserEditCreate(undefined); setVisibleEditUser(false) }}
                                onSuccess={() => { setUserEditCreate(undefined); setVisibleEditUser(false); loadListUser() }}
                            ></EditUser>
                        }
                    </div>
                    <div className="row">
                        {loadUserTable &&
                            <Table
                                columns={[
                                    {
                                        accessorKey: 'samAccountName',
                                        header: 'Usuario',
                                        id: 'samAccountName'
                                    },
                                    {
                                        accessorKey: 'name',
                                        header: 'Nombre',
                                        id: 'name'
                                    },
                                    {
                                        cell: (props) => {
                                            const maxUserLvl = props.row.original.maxUserLvl;
                                            return maxUserLvl.toLowerCase();
                                        },
                                        accessorKey: 'maxUserLvl',
                                        header: 'Role',
                                        id: 'maxUserLvl'
                                    },
                                    {
                                        cell: (props) => {
                                            const memeberOf = props.row.original.memberOf;
                                            return (
                                                <>
                                                    {
                                                        memeberOf.map((member, index) => (
                                                            <Chip
                                                                id={'CG' + index}
                                                                disabled={true}
                                                                size="small"
                                                                text={member.name}
                                                            />
                                                        ))
                                                    }
                                                </>);
                                        },
                                        header: 'Grupos',
                                        id: 'groups'
                                    },
                                    {
                                        cell: (props) => {

                                            return (<>
                                                {((props.row.original.samAccountName != currentUserName && props.row.original.maxUserLvl.toLowerCase() != 'admin') || (isRoot))
                                                    && <>
                                                        <Button icon="EditIcon" size="small" onClick={() => { setVisibleEditUser(true); setVisibleAddUser(false); setUserEditCreate(props.row.original) }}>Editar</Button>
                                                        <Button icon='DeleteIcon' size="small" color="destructive" onClick={() => { askDeleteUser(props.row.original) }}></Button>
                                                    </>
                                                }
                                            </>
                                            );
                                        },
                                        header: 'Opciones',
                                        id: 'options'
                                    }
                                ]}
                                data={usersFiltered}
                                onPaginationChange={(p) => userPagination(p, undefined)}
                                pageCount={pageUCount}
                                pageIndex={pageUIndex}
                                pageSize={pageUSize}
                                totalElements={totalUElements}
                                withPagination
                            />}
                    </div>
                </div>

                <Hr></Hr>
                <Accordion variant="regular">
                    {(isRoot &&
                        <AccordionItem id="AC1" title="Grupos disponibles" >
                            {loadGroupsTable &&
                                <Table
                                    columns={[
                                        {
                                            accessorKey: 'samaccountName',
                                            header: 'Nombre',
                                            id: 'samaccountName'
                                        }
                                    ]}
                                    data={groups}
                                    //onPaginationChange={(pagination) => console.log(pagination)}
                                    pageCount={pageGCount}
                                    pageIndex={pageGIndex}
                                    pageSize={pageGSize}
                                    totalElements={totalGElements}
                                    withPagination
                                />}
                        </AccordionItem>
                    ) || <></>}
                </Accordion>

                <Modal show={showModalDelete} onClose={() => { setShowModalDelete(false) }}>
                    <ModalConfirmation
                        buttonPrimary={{
                            action: deleteUser,
                            text: 'Eliminar'
                        }}
                        buttonSecondary={{
                            action: cancelDelete,
                            text: 'Cancelar'
                        }}
                        destructive
                        subtitle={"¿Quiere eliminar el usuario " + usernameToDelete + "?"}
                        title="Eliminar usuario"

                    />
                </Modal>

                <Modal show={showModalError} onClose={() => { setShowModalError(false) }}>
                    <ModalConfirmation
                        buttonPrimary={{
                            action: () => { setShowModalError(false) },
                            text: 'Ok'
                        }}
                        destructive
                        subtitle={"No se pudo realizar la acción."}
                        title="Error"

                    />
                </Modal>


            </div>
        </>
    );
}

export default AdministrationView;
