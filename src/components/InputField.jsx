import { options } from 'joi';
import React from 'react';

function InputField({
    label,
    type,
    id,
    className,
    placeholder,
    value,
    onChange,
    readOnly,
    options,
}) {
    const renderComponent = () => {
        switch (type) {
            case 'text-area':
                return (
                    <>
                        <label htmlFor={id} className="form-label">
                            {label}
                        </label>
                        <textarea
                            id={id}
                            className={className ? className : 'form-control'}
                            placeholder={placeholder ? placeholder : ''}
                            value={value}
                            onChange={onChange}
                            readOnly={readOnly ? readOnly : false}
                        />
                    </>
                );
            case 'checkbox':
                return (
                    <>
                        <input
                            type={type}
                            id={id}
                            className={className ? className : 'form-control'}
                            placeholder={placeholder ? placeholder : ''}
                            checked={value}
                            onChange={onChange}
                            readOnly={readOnly ? readOnly : false}
                        />
                        <label htmlFor={id} className="form-check-label">
                            {label}
                        </label>
                    </>
                );

            case 'select':
                return (
                    <>
                        <label htmlFor={id} className="form-label">
                            {label}
                        </label>
                        <select
                            id={id}
                            type="select"
                            className="form-select"
                            onChange={onChange}
                            readOnly={readOnly ? readOnly : false}
                            value={value}
                        >
                            {options.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            default:
                return (
                    <>
                        <label htmlFor={id} className="form-label">
                            {label}
                        </label>
                        <input
                            type={type}
                            id={id}
                            className={className ? className : 'form-control'}
                            placeholder={placeholder ? placeholder : ''}
                            value={value}
                            onChange={onChange}
                            readOnly={readOnly ? readOnly : false}
                        />
                    </>
                );
        }
    };

    return (
        <div className={type == 'checkbox' ? 'form-check mb-3' : 'mb-3'}>
            {renderComponent()}
        </div>
    );
}

export default InputField;
