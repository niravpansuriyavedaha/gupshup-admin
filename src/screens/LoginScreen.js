import React, { useState, useEffect } from 'react';
import Joi from 'joi';
import Form from '../components/Form';

const inputComponents = [
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

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

function LoginScreen() {
    const [formError, setFormError] = useState('');
    // const dispatch = useDispatch();
    // const history = useHistory();

    // const { Type } = useSelector((state) => state.user);

    // useEffect(() => {
    //     if (Type === TYPES.SUPERADMIN || Type === TYPES.USER) {
    //         // history.push(PAGES.DASHBOARD);
    //         console.log('here');
    //         window.location.href='/dashboard';
    //     }
    // }, [Type]);

    return (
        <div className="container-fluid">
            <div className="row vh-100 align-items-center justify-content-center">
                <div className="card col-10 col-sm-6 col-md-5 col-lg-4 p-4">
                    <h3 className="text-center mb-4">Login</h3>
                    <Form
                        buttonLabel="Login"
                        onSubmit={(data, isLoading) => {
                            const validateValue = loginSchema.validate(data);

                            if (validateValue.error) {
                                setFormError(validateValue.error.message);
                            } else {
                                // dispatch(login(data, isLoading, setFormError));
                            }
                        }}
                        errorMsg={formError}
                        inputComponents={inputComponents}
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
