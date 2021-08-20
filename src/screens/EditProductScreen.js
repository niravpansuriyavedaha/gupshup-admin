import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useLocation } from 'react-router-dom';
import DataTable from '../components/DataTable';
import InputField from '../components/InputField';
import Button from '../components/Button';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import Form from '../components/Form';
import axios from 'axios';

function EditProductScreen() {
    const MODALS = {
        EDIT_VARIANTS: 'edit_variants',
        DEFAULT: 'default',
    };

    const [currentModal, setCurrentModal] = useState(MODALS.DEFAULT);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const [productData, setProductData] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState();

    const fetchProducts = async () => {
        let resData = await axios.get(`product/${location.state._id}`);

        setProductData(resData.data.data);
    };
    useEffect(async () => {
        fetchProducts();
    }, []);

    const handleOnChange = (e) => {
        setProductData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const handleUpdateClick = async (setLoading) => {
        setLoading(true);
        let updatedProductData = await axios.patch('/product', {
            productId: location.state._id,
            productData,
        });
        fetchProducts();
        setLoading(false);
    };

    const handleEditVariantClick = (data) => {
        setCurrentModal(MODALS.EDIT_VARIANTS);
        setIsModalOpen(true);
        setSelectedVariantIndex(data.rowIndex);
    };

    const InputFieldItems = {
        BasicDetails: [
            {
                label: 'Title',
                keyField: 'title',
                readOnly: true,
            },
            {
                label: 'Description',
                keyField: 'body_html',
                readOnly: true,
            },
            {
                label: 'Serial No',
                keyField: 'id',
                readOnly: true,
            },
            {
                label: 'Weight',
                keyField: 'weight',
            },
        ],
        BasicDetailsPricing: [
            {
                label: 'Retail',
                keyField: 'retail',
            },
            {
                label: 'Compare',
                keyField: 'compare',
            },
            {
                label: 'Cost',
                keyField: 'cost',
            },
        ],
        Supplier: [
            {
                label: 'Supplier Name',
                keyField: 'suppiler_name',
            },
            {
                label: 'Item Code',
                keyField: 'id',
                readOnly: true,
            },
            {
                label: 'Barcode/EAN',
                keyField: 'id',
                readOnly: true,
            },
            {
                label: 'Lead Time',
                keyField: 'lead_time',
            },
            {
                label: 'MOQ',
                keyField: 'moq',
            },
            {
                label: 'Pack Size',
                keyField: 'pack_size',
            },
        ],
        Stock: [
            {
                label: 'Current Stock',
                keyField: 'stock',
                readOnly: true,
            },
            {
                label: 'Available Stock',
                keyField: 'available_stock',
                readOnly: true,
            },
            {
                label: 'On Order Stock',
                keyField: 'on_order_stock',
                readOnly: true,
            },
            {
                label: 'On Repair Stock',
                keyField: 'on_repair_stock',
                readOnly: true,
            },
        ],
        Manufacture: [
            {
                label: 'Manufacturer Name',
                keyField: 'manufacturer_name',
            },
            {
                label: 'Labor Cost',
                keyField: 'labor_cost',
            },
            {
                label: 'Manufacturing Cost',
                keyField: 'manufacturing_cost',
            },
        ],
        Note: [
            {
                type: 'text-area',
                label: 'Any Note',
                keyField: 'note',
            },
            {
                type: 'text-area',
                label: 'Remarks',
                keyField: 'remarks',
            },
            {
                type: 'text-area',
                label: 'Disclaimer',
                keyField: 'disclaimer',
            },
        ],
        Seo: [
            {
                label: 'SEO Title',
                keyField: 'seo_title',
            },
            {
                label: 'SEO Description',
                keyField: 'seo_description',
            },
        ],
    };

    const content = (section) =>
        InputFieldItems[section].map((e, i) => (
            <div className="col-12 col-sm-6 mb-3" key={i}>
                <InputField
                    type={e.type ? e.type : 'text'}
                    label={e.label}
                    id={e.keyField}
                    value={productData && productData[e.keyField]}
                    onChange={handleOnChange}
                    readOnly={e.readOnly || false}
                />
            </div>
        ));

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const getModalContent = () => {
        let title;
        let content;
        let inputComponents;
        switch (currentModal) {
            case MODALS.EDIT_VARIANTS:
                inputComponents = [
                    {
                        id: 'title',
                        label: 'Title',
                        type: 'text',
                    },
                    {
                        id: 'price',
                        type: 'text',
                        label: 'Price',
                    },
                    {
                        id: 'sku',
                        type: 'text',
                        label: 'SKU',
                    },
                    {
                        id: 'barcode',
                        type: 'text',
                        label: 'Barcode',
                    },
                    {
                        id: 'inventory_quantity',
                        type: 'text',
                        label: 'Inventory Quantity',
                    },
                    {
                        id: 'created_at',
                        type: 'text',
                        label: 'Created At',
                    },
                    {
                        id: 'updated_at',
                        type: 'text',
                        label: 'Updated At',
                    },
                ];
                title = 'Edit Columns';
                content = (
                    <Form
                        buttonLabel="Update"
                        onSubmit={(data, setLoading) => {
                            closeModal();
                        }}
                        inputComponents={inputComponents}
                        defaultValue={inputComponents.reduce((e, newItem) => {
                            return {
                                ...e,
                                [newItem.id]:
                                    productData.variants[selectedVariantIndex][
                                        newItem.id
                                    ],
                            };
                        }, {})}
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
                <div
                    className="modal-inner"
                    style={{ overflowY: 'auto', maxHeight: '70vh' }}
                >
                    {content}
                </div>
            </div>
        );
    };

    return (
        <div className="right-content-div">
            <h4 className="mb-3">Edit Product</h4>

            <Paper className="mb-3">
                <div className="accordion" id="accordionPanelsStayOpenExample">
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingOne"
                        >
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseOne"
                                aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne"
                            >
                                <b>Basic Details</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="panelsStayOpen-headingOne"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">
                                        {content('BasicDetails')}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingTest"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTest"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseTest"
                            >
                                <b>Pricing</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseTest"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingTest"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">
                                        {content('BasicDetailsPricing')}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingTwo"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseTwo"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseTwo"
                            >
                                <b>Supplier</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingTwo"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">
                                        {content('Supplier')}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingThree"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseThree"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseThree"
                            >
                                <b>Stock</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingThree"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">
                                        {content('Stock')}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingFour"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseFour"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseFour"
                            >
                                <b>Manufacture</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseFour"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingFour"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">
                                        {content('Manufacture')}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingFive"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseFive"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseFive"
                            >
                                <b>Note</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseFive"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingFive"
                        >
                            <div className="accordion-body">
                                <form className="form-group">
                                    <div className="row">{content('Note')}</div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingSix"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseSix"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseSix"
                            >
                                <b>History</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseSix"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingSix"
                        >
                            <div className="accordion-body">
                                {productData && (
                                    <DataTable
                                        withToolbar={false}
                                        withCheckbox={false}
                                        columns={[
                                            {
                                                id: 'timestamp',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Timestemp',
                                                disableSorting: true,
                                                type: 'localeString',
                                            },
                                            {
                                                id: 'branch',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Branch',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'user',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'User',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'type',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Type',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'record_no',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Record No#',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'cost',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Cost',
                                                disableSorting: true,
                                            },
                                        ]}
                                        rows={productData.history}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingSeven"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseSeven"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseSeven"
                            >
                                <b>Variant</b>
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseSeven"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingSeven"
                        >
                            <div className="accordion-body">
                                {productData && (
                                    <DataTable
                                        withToolbar={false}
                                        withCheckbox={false}
                                        columns={[
                                            {
                                                id: 'id',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Serial Number',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'title',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Title',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'price',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Price',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'sku',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'SKU',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'barcode',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Barcode',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'inventory_quantity',
                                                numeric: true,
                                                disablePadding: false,
                                                label: 'Inventory Quantity',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'created_at',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Created At',
                                                disableSorting: true,
                                            },
                                            {
                                                id: 'updated_at',
                                                numeric: false,
                                                disablePadding: false,
                                                label: 'Updated At',
                                                disableSorting: true,
                                            },
                                            // {
                                            //     id: 'MODALS.EDIT_WITH_SHOPIFY',
                                            //     numeric: false,
                                            //     disablePadding: false,
                                            //     disableSorting: true,
                                            //     label: 'Edit',
                                            //     componentWithData: {
                                            //         component: Button,
                                            //         onClick:
                                            //             handleEditVariantClick,
                                            //         label: 'Edit',
                                            //     },
                                            // },
                                        ]}
                                        rows={productData.variants}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleUpdateClick}
                    className="btn btn-primary mx-3 my-3"
                    label="Update"
                />
            </Paper>
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
}

export default EditProductScreen;
