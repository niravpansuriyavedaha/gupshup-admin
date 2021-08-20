import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joi from 'joi';
import DataTable from '../components/DataTable';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Form from '../components/Form';
import Button from '../components/Button';

const UserScreen = (props) => {
    const MODALS = {
        CREATE_USER: 'create_user',
        UPDATE_USER: 'update_user',
        MANAGE_ROLE: 'manage_role',
    };

    const userSchema = Joi.object({
        username: Joi.string().alphanum().min(4).required(),
        password: Joi.string().required(),
    });

    const [currentModal, setCurrentModal] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');

    const [rows, setRows] = useState([]);
    const [currentRow, setCurrentRow] = useState({
        rowIndex: -1,
        colIndex: -1,
    });

    const [allPermissions, setAllPermissions] = useState([]);

    useEffect(async () => {
        props.setScreenLoading(true);

        const { data: resData } = await axios.get('/user/all');
        setRows(resData.data);

        const { data: perResData } = await axios.get('/permission/all');
        const permissionArr = Object.values(perResData.data).reduce(
            (accumulator, currentValue) => {
                return accumulator.concat(currentValue);
            },
            [],
        );
        setAllPermissions(permissionArr);

        props.setScreenLoading(false);
    }, []);

    const handleViewRoleClick = (data, setLoading) => {
        setCurrentModal(MODALS.MANAGE_ROLE);
        setIsModalOpen(true);
    };

    const handleUpdatePasswordClick = (data, setLoading) => {
        setCurrentRow({ rowIndex: data.rowIndex, colIndex: data.colIndex });
        setCurrentModal(MODALS.UPDATE_USER);
        setIsModalOpen(true);
    };

    const handleCreateUserClick = (data, setLoading) => {
        setCurrentModal(MODALS.CREATE_USER);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getModalContent = () => {
        let title;
        let content;
        let inputComponents;
        switch (currentModal) {
            case MODALS.UPDATE_USER:
                inputComponents = [
                    {
                        label: 'Username',
                        type: 'text',
                        id: 'username',
                        readOnly: true,
                    },
                    {
                        label: 'Password',
                        type: 'password',
                        id: 'password',
                    },
                ];

                title = 'Update Password';
                content = (
                    <Form
                        defaultValue={{
                            username: rows[currentRow.rowIndex].username,
                        }}
                        buttonLabel="Update"
                        onSubmit={async (data, isLoading) => {
                            try {
                                const validateValue = userSchema.validate(data);

                                if (validateValue.error) {
                                    setFormError(validateValue.error.message);
                                } else {
                                    setFormError('');

                                    isLoading(true);

                                    const { data: resData } = await axios.patch(
                                        '/user',
                                        data,
                                    );

                                    if (resData.status === 200) {
                                        closeModal();
                                    } else {
                                        setFormError('Something went wrong!');
                                    }

                                    isLoading(false);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        inputComponents={inputComponents}
                        errorMsg={formError}
                    />
                );
                break;

            case MODALS.MANAGE_ROLE:
                inputComponents = allPermissions.map((obj) => {
                    return {
                        label: obj.permission,
                        type: 'checkbox',
                        id: obj._id,
                        className: 'form-check-input',
                    };
                });

                title = 'Manage Roles';
                content = (
                    <Form
                        buttonLabel="Update"
                        onSubmit={() => {}}
                        inputComponents={inputComponents}
                    />
                );
                break;

            case MODALS.CREATE_USER:
                inputComponents = [
                    {
                        label: 'Username',
                        type: 'text',
                        id: 'username',
                    },
                    {
                        label: 'Password',
                        type: 'password',
                        id: 'password',
                    },
                ];

                title = 'Create User';
                content = (
                    <Form
                        buttonLabel="Create"
                        onSubmit={async (data, isLoading) => {
                            try {
                                const validateValue = userSchema.validate(data);

                                if (validateValue.error) {
                                    setFormError(validateValue.error.message);
                                } else {
                                    setFormError('');

                                    isLoading(true);

                                    const { data: resData } = await axios.post(
                                        '/user',
                                        data,
                                    );

                                    if (resData.status === 200) {
                                        setRows(resData.data);

                                        closeModal();
                                    } else {
                                        setFormError('Something went wrong!');
                                    }

                                    isLoading(false);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        errorMsg={formError}
                        inputComponents={inputComponents}
                    />
                );

            default:
                break;
        }

        return { title, content };
    };

    const getModalBody = () => {
        const { title, content } = getModalContent();

        return (
            <div className="modal-cover">
                <div className="modal-title">
                    <h4>{title}</h4>
                    <CloseIcon onClick={closeModal} className="modal-close" />
                </div>
                <hr />
                <div className="modal-inner">{content}</div>
            </div>
        );
    };

    const cols = [
        {
            id: 'username',
            numeric: false,
            disablePadding: false,
            label: 'Username',
            disableSorting: true,
        },
        {
            id: MODALS.UPDATE_USER,
            numeric: false,
            disablePadding: false,
            label: 'Edit',
            componentWithData: {
                component: Button,
                onClick: handleUpdatePasswordClick,
                label: 'Update Password',
            },
        },
        {
            id: MODALS.MANAGE_ROLE,
            numeric: false,
            disablePadding: false,
            label: 'Roles',
            componentWithData: {
                component: Button,
                onClick: handleViewRoleClick,
                label: 'View',
            },
        },
    ];

    return (
        <div className="right-content-div">
            <h4 className="mb-3">Users</h4>
            <DataTable
                title={[
                    {
                        key: MODALS.CREATE_USER,
                        component: Button,
                        onClick: handleCreateUserClick,
                        label: 'Create User',
                    },
                ]}
                withCheckbox={true}
                columns={cols}
                rows={rows}
                onCheckboxSelect={() => {}}
                handleDeleteButtonClick={async (selected, setSelected) => {
                    try {
                        const usernames = selected.map(
                            (elem) => rows[elem].username,
                        );
                        const { data: resData } = await axios.delete('/user', {
                            data: { usernames },
                        });

                        if (resData.status === 200) {
                            setRows(resData.data);
                            setSelected([]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }}
            />

            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {getModalBody()}
            </Modal>
        </div>
    );
};

export default UserScreen;
