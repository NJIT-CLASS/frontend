import React from 'react';
import InputPassword from 'react-ux-password-field';

const PasswordField = ({value, onChange, Strings}) => {
    return (
    <InputPassword onChange={onChange.bind(this)}
                  passwordString={value}
                 minLength={6}
                 strengthLang={[Strings.Bad, Strings.NotGood, Strings.Decent, Strings.Strong, Strings.Great]}
               />
    );

};

PasswordField.defaultProps = {
    Strings: {
        Bad: 'Bad',
        NotGood: 'Not good',
        Decent: 'Decent',
        Strong: 'Strong',
        Great: 'Great'
    }
};

export default PasswordField;
