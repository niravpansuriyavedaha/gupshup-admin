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
import { productScreen_columnKeys } from '../store/actions/saveSettings';
import { SHOP_NAME } from '../config/index';

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

const ProductScreen = () => {
    const MODALS = {
        EDIT_COLUMNS: 'edit_columns',
        EDIT: 'edit',
        EDIT_WITH_SHOPIFY: 'edit_with_shopify',
    };
    const droppableId = 'cols';

    const dispatch = useDispatch();
    let _columnKeys = useSelector((state) => state).settings.productScreen
        .columnKeys;

    const [currentModal, setCurrentModal] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [allCols, setAllCols] = useState([]);
    const [cols, setCols] = useState([]);
    const [columnKeys, setColumKeys] = useState([]);

    const fetchProducts = async ({ order, orderBy, page, rowsPerPage }) => {
        // let resData = await axios.get('/product');
        // setRows(resData.data.data);

        try {
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
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(async () => {
        // const { data: resData } = await axios.get('/property');
        // setRows(resData.data);

        setAllCols([
            {
                id: 'image',
                numeric: false,
                disablePadding: false,
                label: 'Image',
                disableSorting: true,
                type: 'img',
                componentWithData: {
                    component: ImageComponent,
                },
            },
            {
                id: 'title',
                numeric: false,
                disablePadding: false,
                label: 'Name',
                disableSorting: false,
                type: 'link',
                componentWithData: {
                    component: LinkComponent,
                },
            },
            {
                id: 'body_html',
                numeric: false,
                disablePadding: false,
                label: 'Description',
                disableSorting: false,
            },
            {
                id: 'product_type',
                numeric: false,
                disablePadding: false,
                label: 'Type',
                disableSorting: false,
            },
            {
                id: 'price',
                numeric: true,
                disablePadding: false,
                label: 'Price',
                disableSorting: false,
            },
            {
                id: 'vendor',
                numeric: false,
                disablePadding: false,
                label: 'Vendor',
                disableSorting: false,
            },
            {
                id: 'labor_cost',
                numeric: false,
                disablePadding: false,
                label: 'Cost',
                disableSorting: false,
            },
            {
                id: 'stock',
                numeric: false,
                disablePadding: false,
                label: 'Quantity',
                disableSorting: false,
            },
            {
                id: 'barcode',
                numeric: false,
                disablePadding: false,
                label: 'Barcode',
                disableSorting: false,
            },
            {
                id: 'seo_title',
                numeric: false,
                disablePadding: false,
                label: 'SEO Title',
                disableSorting: false,
            },
            {
                id: 'seo_description',
                numeric: false,
                disablePadding: false,
                label: 'SEO Description',
                disableSorting: false,
            },
            {
                id: 'compare_price',
                numeric: true,
                disablePadding: false,
                label: 'Compare Price',
                disableSorting: false,
            },
            {
                id: 'sku',
                numeric: false,
                disablePadding: false,
                label: 'SKU',
                disableSorting: false,
            },
            {
                id: 'track_qty',
                numeric: true,
                disablePadding: false,
                label: 'Track Qty',
                disableSorting: false,
            },
            {
                id: 'continue_selling',
                numeric: false,
                disablePadding: false,
                label: 'Continue Selling',
                disableSorting: false,
                type: 'checkbox',
                componentWithData: {
                    component: InputCheckBox,
                },
            },
            {
                id: 'tax',
                numeric: true,
                disablePadding: false,
                label: 'Tax',
                disableSorting: false,
            },
            {
                id: MODALS.EDIT_WITH_SHOPIFY,
                numeric: false,
                disablePadding: false,
                disableSorting: true,
                label: 'Edit',
                componentWithData: {
                    component: Button,
                    onClick: handleEditWithShopifyClick,
                    label: 'Edit with Shopify',
                },
            },
        ]);

        setColumKeys(_columnKeys);

        // setRows(productData);
        // let resData = await axios.get('/product');
        // setRows(resData.data.data);
        fetchProducts({ order: '', orderBy: '', page: 0, rowsPerPage: 5 });
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

    const handleUpdateClick = (data, setLoading) => {
        setCurrentModal(MODALS.EDIT_COLUMNS);
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
                <hr />
                <div className="modal-title">
                    <Button
                        label="Save"
                        onClick={() => {
                            dispatch(productScreen_columnKeys(columnKeys));
                            closeModal();
                        }}
                    />
                </div>
            </div>
        );
    };

    const ImageComponent = (props) => (
        <img className="product-thumbnail" {...props} />
    );

    const LinkComponent = ({ props, label }) => <Link {...props}>{label}</Link>;

    return (
        <div className="right-content-div product-screen">
            <h4 className="mb-3">Products</h4>

            {cols.length > 0 ? (
                <DataTable
                    title={[
                        {
                            key: MODALS.EDIT_COLUMNS,
                            component: Button,
                            onClick: handleUpdateClick,
                            label: 'Edit Columns',
                        },
                    ]}
                    withCheckbox={true}
                    columns={[
                        ...cols,
                        {
                            id: MODALS.EDIT_WITH_SHOPIFY,
                            numeric: false,
                            disablePadding: false,
                            disableSorting: true,
                            label: 'Edit',
                            componentWithData: {
                                component: Button,
                                onClick: handleEditWithShopifyClick,
                                label: 'Edit with Shopify',
                            },
                        },
                    ]}
                    rows={rows}
                    onCheckboxSelect={() => {}}
                    handleDeleteButtonClick={() => {}}
                    withPagination={true}
                    paginatedLength={rowCount}
                    paginatedHandler={fetchProducts}
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

export default ProductScreen;
