/**
 * Internal dependencies
 */
import { BaseControl, withInstanceId, Component } from '@wordpress/components';

import { pull } from 'lodash';

// import './style.scss';

function CheckboxGroup({heading, options = [], values = [], help, instanceId, onChange, ...props}) {
    const id = `inspector-checkbox-control-${ instanceId }`;

    const onChangeValue = ( event ) => {
        if (event.target.checked) {
            values.push(event.target.value);
        } else {
            values = pull(values, event.target.value);
        }

        return onChange(values);
    };

    return (
        <BaseControl label={ heading } id={ id } help={ help }>
            { options.map((option, index) => (
                <div key={ `${id}-${index}` }>
                    <input
                        id={ `${id}-${index}` }
                        className="components-checkbox-control__input"
                        name={ id }
                        value={ option.value }
                        onChange={ onChangeValue }
                        type="checkbox"
                        aria-describedby={ !!help ? id + '__help' : undefined }
                        { ...props }
                    />

                    <label className="components-checkbox-control__label" htmlFor={ `${id}-${index}` }>
                        { option.label }
                    </label>
                </div>
            )) }
        </BaseControl>
    );
}

export default withInstanceId( CheckboxGroup );
