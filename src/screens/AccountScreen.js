import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import DataTable from '../components/DataTable';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Form from '../components/Form';
import Button from '../components/Button';
// import { products as productData } from '../config/products.json';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { accountScreen_columnKeys } from '../store/actions/saveSettings';
import { SHOP_NAME, ACCOUNT_TYPES } from '../config/index';
import InputField from '../components/InputField';
import { SUPPLIER } from '../utils/keys/account';

const Item = ({ item, onChange, dragProps, isDragging }) => {
    const { id, status, label } = item;
    return (
        <div className={`item-container ${isDragging ? 'item-selected' : ''}`}>
            <input
                type="checkbox"
                id={id}
                checked={status}
                onChange={onChange}
            />
            <label className="item-label" htmlFor={id}>
                {label}
            </label>
            <div className="item-menu-btn" {...dragProps}>
                <MenuIcon />
            </div>
        </div>
    );
};

const AccountScreen = () => {
    const MODALS = {
        CREATE_ACCOUNT: 'create_account',
        EDIT_COLUMNS: 'edit_columns',
        EDIT: 'edit',
        EDIT_WITH_SHOPIFY: 'edit_with_shopify',
    };
    const droppableId = 'cols';

    const dispatch = useDispatch();
    const [accountType, setAccountType] = useState(ACCOUNT_TYPES.SUPPLIER);
    let _columnKeys = useSelector((state) => state)?.settings?.accountScreen[
        ACCOUNT_TYPES.SUPPLIER
    ]?.columnKeys;
    const [currentModal, setCurrentModal] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [allCols, setAllCols] = useState([]);
    const [cols, setCols] = useState([]);
    const [columnKeys, setColumKeys] = useState([]);
    const [formError, setFormError] = useState('');

    const userSchema = Joi.object({
        username: Joi.string().alphanum().min(4).required(),
        password: Joi.string().required(),
    });

    const fetchProducts = async ({ order, orderBy, page, rowsPerPage }) => {
        // let resData = await axios.get('/product');
        // setRows(resData.data.data);

        let resData = await axios.get('/product/paginate', {
            params: {
                order,
                orderBy,
                page,
                rowsPerPage,
            },
        });

        setRowCount(resData.data.data?.count[0].total);
        setRows(resData.data.data?.list);
    };
    useEffect(async () => {
        setAllCols([
            {
                id: SUPPLIER.CONTACT_NAME,
                numeric: false,
                disablePadding: false,
                label: 'Name',
                disableSorting: false,
            },
            {
                id: SUPPLIER.CONTACT_EMAIL,
                numeric: false,
                disablePadding: false,
                label: 'Email',
                disableSorting: false,
            },
        ]);
        setColumKeys(_columnKeys);
        // fetchProducts({ order: '', orderBy: '', page: 0, rowsPerPage: 5 });
        setRowCount(5);
        setRows([
            {
                [SUPPLIER.CONTACT_NAME]: 'test',
                [SUPPLIER.CONTACT_EMAIL]: 'test@test.com',
            },
            {
                [SUPPLIER.CONTACT_NAME]: 'test2',
                [SUPPLIER.CONTACT_EMAIL]: 'test2@test.com',
            },
            {
                [SUPPLIER.CONTACT_NAME]: 'test3',
                [SUPPLIER.CONTACT_EMAIL]: 'test3@test.com',
            },
            {
                [SUPPLIER.CONTACT_NAME]: 'test4',
                [SUPPLIER.CONTACT_EMAIL]: 'test4@test.com',
            },
            {
                [SUPPLIER.CONTACT_NAME]: 'test5',
                [SUPPLIER.CONTACT_EMAIL]: 'test5@test.com',
            },
        ]);
    }, []);

    useEffect(() => {
        setColumKeys(_columnKeys);
    }, [_columnKeys]);

    useEffect(() => {
        if (allCols && columnKeys) {
            if (allCols.length && columnKeys.length) {
                setCols(
                    columnKeys
                        .filter((obj) => obj.status)
                        .map((col) => allCols.find((e) => e.id === col.id)),
                );
            }
        }
    }, [columnKeys]);

    const openModal = (id) => {
        setCurrentModal(id);
        setIsModalOpen(true);
    };

    const handleEditWithShopifyClick = (data, setLoading) => {
        window.open(
            `https://${SHOP_NAME}.myshopify.com/admin/products/${data.row.id}`,
            '',
            'width=800,height=800',
        );
    };

    const onDragEnd = ({ destination, source, draggableId }) => {
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        setColumKeys((old) => {
            let kk = [...old];
            let temp = kk.splice(source.index, 1);
            kk.splice(destination.index, 0, temp[0]);
            return kk;
        });
    };

    const InputCheckBox = ({ value }) => {
        return (
            <input
                type="checkbox"
                // className="form-control"
                checked={value}
                readOnly={true}
            />
        );
    };

    const handleColumnChange = (e) => {
        setColumKeys((old) => {
            return [...old].map((ele) => {
                if (ele.id === e.target.id) ele.status = e.target.checked;
                return { ...ele };
            });
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getModalContent = () => {
        let title;
        let content;
        let inputComponents;
        switch (currentModal) {
            case MODALS.EDIT_COLUMNS:
                console.log(columnKeys);
                inputComponents = columnKeys
                    .filter((col) => !col.notDisplay)
                    .map((obj) => {
                        return {
                            label: obj.label,
                            type: 'checkbox',
                            id: obj.id,
                            className: 'form-check-input',
                        };
                    });

                title = 'Edit Columns';

                content = (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={droppableId}>
                            {(provided, snapshot) => (
                                <div
                                    className="dropable-area"
                                    style={{
                                        backgroundColor:
                                            snapshot.isDraggingOver &&
                                            '#c5c5c5',
                                    }}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {columnKeys.map((item, index) => (
                                        <Draggable
                                            draggableId={item.id}
                                            index={index}
                                            key={item.id}
                                        >
                                            {(provided2, snapshot2) => (
                                                <div
                                                    ref={provided2.innerRef}
                                                    {...provided2.draggableProps}
                                                >
                                                    <Item
                                                        item={item}
                                                        onChange={
                                                            handleColumnChange
                                                        }
                                                        dragProps={
                                                            provided2.dragHandleProps
                                                        }
                                                        isDragging={
                                                            snapshot2.isDragging
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                );
                break;
            case MODALS.CREATE_ACCOUNT:
                title = 'Create ' + accountType;
                inputComponents = [
                    {
                        label: 'Account Number',
                        type: 'text',
                        id: SUPPLIER.ACCOUNT_NUMBER,
                    },
                    {
                        label: 'Company Name',
                        type: 'text',
                        id: SUPPLIER.COMPANY_NAME,
                    },
                    {
                        label: 'Address1',
                        type: 'text',
                        id: SUPPLIER.ADDRESS1,
                    },
                    {
                        label: 'Address2',
                        type: 'text',
                        id: SUPPLIER.ADDRESS2,
                    },
                    {
                        label: 'City',
                        type: 'text',
                        id: SUPPLIER.CITY,
                    },
                    {
                        label: 'State / Province',
                        type: 'text',
                        id: SUPPLIER.STATE,
                    },
                    {
                        label: 'Zip / PostCode',
                        type: 'text',
                        id: SUPPLIER.POSTAL_CODE,
                    },
                    {
                        label: 'Country',
                        type: 'text',
                        id: SUPPLIER.COUNTRY,
                    },
                    {
                        label: 'Supplier Tax Type',
                        type: 'text',
                        id: SUPPLIER.TAX_TYPE,
                    },
                    {
                        label: 'Payment Terms',
                        type: 'text',
                        id: SUPPLIER.PAYMENT_TERMS,
                    },
                    {
                        label: 'Payment Methods',
                        type: 'text',
                        id: SUPPLIER.PAYMENT_METHOD,
                    },
                    {
                        label: 'Phone',
                        type: 'text',
                        id: SUPPLIER.PHONE,
                    },
                    {
                        label: 'Phone toll free',
                        type: 'text',
                        id: SUPPLIER.PHONE_TOLL_FREE,
                    },
                    {
                        label: 'Fax',
                        type: 'text',
                        id: SUPPLIER.FAX,
                    },
                    {
                        label: 'Contact Name',
                        type: 'text',
                        id: SUPPLIER.CONTACT_NAME,
                    },
                    {
                        label: 'Contact Email',
                        type: 'text',
                        id: SUPPLIER.CONTACT_EMAIL,
                    },
                    {
                        label: 'Website Adress (include http://)',
                        type: 'text',
                        id: SUPPLIER.WEBSITE,
                    },
                    {
                        label: 'Online Order From or Portal (include http://)',
                        type: 'text',
                        id: SUPPLIER.ORDER_FROM_WEBSITE,
                    },
                    {
                        label: 'Username',
                        type: 'text',
                        id: SUPPLIER.USERNAME,
                    },
                    {
                        label: 'Supplier notes (private)',
                        type: 'text-area',
                        id: SUPPLIER.SUPPLIER_NOTES,
                    },
                    {
                        label: 'PO Notes Template',
                        type: 'text-area',
                        id: SUPPLIER.PO_NOTES,
                    },
                ];
                content = (
                    <Form
                        buttonLabel="Create"
                        onSubmit={async (data, isLoading) => {
                            // try {
                            //     const validateValue = userSchema.validate(data);
                            //     if (validateValue.error) {
                            //         setFormError(validateValue.error.message);
                            //     } else {
                            //         setFormError('');
                            //         isLoading(true);
                            //         const { data: resData } = await axios.post(
                            //             '/user',
                            //             data,
                            //         );
                            //         if (resData.status === 200) {
                            //             setRows(resData.data);
                            //             closeModal();
                            //         } else {
                            //             setFormError('Something went wrong!');
                            //         }
                            //         isLoading(false);
                            //     }
                            // } catch (error) {
                            //     console.log(error);
                            // }
                        }}
                        errorMsg={formError}
                        inputComponents={inputComponents}
                    />
                );
                break;

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
                <div
                    className="modal-inner"
                    style={{ overflowY: 'auto', maxHeight: '70vh' }}
                >
                    {content}
                </div>
                {/* <hr /> */}
                {currentModal === MODALS.EDIT_COLUMNS && (
                    <div className="modal-title d-flex justify-content-center align-items-center mt-3">
                        <Button
                            label="Save"
                            onClick={() => {
                                dispatch(
                                    accountScreen_columnKeys(
                                        columnKeys,
                                        accountType,
                                    ),
                                );
                                closeModal();
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const ImageComponent = (props) => (
        <img className="product-thumbnail" {...props} />
    );

    const LinkComponent = ({ props, label }) => <Link {...props}>{label}</Link>;

    return (
        <div className="right-content-div product-screen">
            <div className="row">
                <div className=" col-sm-12 col-xs-12 col-md-6 col-12">
                    <h4 className="mb-3">Account</h4>
                </div>

                <div className="d-flex col-xs-12 col-sm-12 col-md-6 col-12">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        style={{ marginRight: '0.5rem', flex: 2 }}
                    />

                    <select
                        className="form-select"
                        style={{ flex: 1 }}
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        {Object.values(ACCOUNT_TYPES).map((e, i) => (
                            <option key={i}>{e}</option>
                        ))}
                    </select>
                </div>
            </div>

            {cols.length > 0 ? (
                <DataTable
                    title={[
                        {
                            key: MODALS.EDIT_COLUMNS,
                            component: Button,
                            onClick: openModal.bind(this, MODALS.EDIT_COLUMNS),
                            label: 'Edit Columns',
                        },
                        {
                            key: MODALS.CREATE_ACCOUNT,
                            component: Button,
                            onClick: openModal.bind(
                                this,
                                MODALS.CREATE_ACCOUNT,
                            ),
                            label: 'Create',
                            className: 'ml-5',
                        },
                    ]}
                    withCheckbox={true}
                    columns={cols}
                    rows={rows}
                    onCheckboxSelect={() => {}}
                    handleDeleteButtonClick={() => {}}
                    // withPagination={true}
                    // paginatedLength={rowCount}
                    // paginatedHandler={fetchProducts}
                />
            ) : (
                <></>
            )}

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

export default AccountScreen;
