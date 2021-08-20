import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import DataTable from '../components/DataTable';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Form from '../components/Form';
import Button from '../components/Button';

const PropertyScreen = () => {
    const MODALS = {
        CREATE_PROPERTY: 'create_property',
        UPDATE_PROPERTY: 'update_property',
        DELETE_PROPERTY: 'delete_property',
    };

    const propertySchema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
    });

    const [currentModal, setCurrentModal] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');

    const [rows, setRows] = useState([]);
    const [currentRow, setCurrentRow] = useState({
        rowIndex: -1,
        colIndex: -1,
    });

    useEffect(async () => {
        const { data: resData } = await axios.get('/property');
        setRows(resData.data);
    }, []);

    const handleDeleteClick = (data, setLoading) => {
        setCurrentModal(MODALS.DELETE_PROPERTY);
        setIsModalOpen(true);
    };

    const handleUpdateClick = (data, setLoading) => {
        setCurrentRow({ rowIndex: data.rowIndex, colIndex: data.colIndex });
        setCurrentModal(MODALS.UPDATE_PROPERTY);
        setIsModalOpen(true);
    };

    const handleCreateClick = (data, setLoading) => {
        setCurrentModal(MODALS.CREATE_PROPERTY);
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
            case MODALS.UPDATE_PROPERTY:
                inputComponents = [
                    {
                        label: 'Name',
                        type: 'text',
                        id: 'name',
                        readOnly: true
                    },
                    {
                        label: 'Type',
                        type: 'select',
                        id: 'type',
                        options: [
                            { key: 'Number', value: 'Number' },
                            { key: 'String', value: 'String' },
                        ],
                    },
                ];

                title = 'Update Property';
                content = (
                    <Form
                        defaultValue={{
                            name: rows[currentRow.rowIndex].name,
                            type: rows[currentRow.rowIndex].type
                        }}
                        buttonLabel="Update"
                        onSubmit={async (data, isLoading) => {
                            try {
                                const validateValue =
                                    propertySchema.validate(data);

                                if (validateValue.error) {
                                    setFormError(validateValue.error.message);
                                } else {
                                    setFormError('');

                                    isLoading(true);

                                    data.id = rows[currentRow.rowIndex]._id;

                                    console.log(data);

                                    const { data: resData } = await axios.patch(
                                        '/property',
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

            case MODALS.DELETE_PROPERTY:
                title = 'Delete Property';
                content = <p>Are you sure your want to delete this?</p>;
                break;

            case MODALS.CREATE_PROPERTY:
                inputComponents = [
                    {
                        label: 'Name',
                        type: 'text',
                        id: 'name',
                    },
                    {
                        label: 'Type',
                        type: 'select',
                        id: 'type',
                        options: [
                            { key: 'Number', value: 'Number' },
                            { key: 'String', value: 'String' },
                        ],
                    },
                ];

                title = 'Create Property';
                content = (
                    <Form
                        buttonLabel="Create"
                        onSubmit={(data, isLoading) => {
                            console.log(data, isLoading);
                            isLoading(true);
                        }}
                        inputComponents={inputComponents}
                        onSubmit={async (data, isLoading) => {
                            try {
                                const validateValue =
                                    propertySchema.validate(data);

                                if (validateValue.error) {
                                    setFormError(validateValue.error.message);
                                } else {
                                    setFormError('');

                                    isLoading(true);

                                    const { data: resData } = await axios.post(
                                        '/property',
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
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
            disableSorting: true,
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
            disableSorting: true,
        },
        {
            id: MODALS.UPDATE_PROPERTY,
            numeric: false,
            disablePadding: false,
            label: 'Edit',
            componentWithData: {
                component: Button,
                onClick: handleUpdateClick,
                label: 'Update Property',
            },
        },
        {
            id: MODALS.DELETE_PROPERTY,
            numeric: false,
            disablePadding: false,
            label: 'Delete',
            componentWithData: {
                component: Button,
                componentProps: {
                    btnClassType: 'danger'
                },
                onClick: handleDeleteClick,
                label: 'Delete',
            },
        },
    ];

    return (
        <div className="right-content-div">
            <h4 className="mb-3">Properties</h4>
            <DataTable
                title={[
                    {
                        key: MODALS.CREATE_PROPERTY,
                        component: Button,
                        onClick: handleCreateClick,
                        label: 'Create Property',
                    },
                ]}
                withCheckbox={true}
                columns={cols}
                rows={rows}
                onCheckboxSelect={() => {}}
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

export default PropertyScreen;
