import React, { useEffect, useState } from 'react';
import InputField from './InputField';
import Button from './Button';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Form({
    inputComponents,
    buttonLabel,
    onSubmit,
    errorMsg,
    defaultValue,
}) {
    const [data, setData] = useState(
        Object.fromEntries(
            inputComponents.map((input) => {
                if (!defaultValue && input.type === 'select') {
                    return [input.id, input.options[0].value];
                } else if (!defaultValue && input.type === 'checkbox') {
                    return [input.id, false];
                }

                if (defaultValue && input.id in defaultValue) {
                    return [input.id, defaultValue[input.id]];
                } else {
                    return [input.id, ''];
                }
            }),
        ),
    );

    const handleChange = (e) => {
        switch (e.target.getAttribute('type')) {
            case 'checkbox':
                setData((prevData) => ({
                    ...prevData,
                    [e.target.id]: e.target.checked,
                }));
                break;

            default:
                setData((prevData) => ({
                    ...prevData,
                    [e.target.id]: e.target.value,
                }));
                break;
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="form-group">
            {inputComponents.map((input, index) => (
                <InputField
                    key={index}
                    {...input}
                    value={data[input.id]}
                    onChange={handleChange}
                />
            ))}

            {errorMsg && (
                <div className="invalid-feedback d-block mb-4">
                    {capitalizeFirstLetter(errorMsg.replaceAll('"', ''))}
                </div>
            )}

            <div className="d-flex justify-content-center">
                <Button
                    className="px-4"
                    btnClassType="primary"
                    label={buttonLabel}
                    onClick={onSubmit.bind(this, data)}
                />
            </div>
        </form>
    );
}

export default Form;
