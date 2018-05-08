import { Component } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { pull } from 'lodash';
import { getConfigValue, default as getConfig } from '../../config';

class Personalisation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: [],
            options: [],
        };

        this.onChange = this.onChange.bind(this);
        this.checkbox = this.checkbox.bind(this);
    }

    componentDidMount() {
        this.setState({
            values: this.props.values || [],
            options: getConfigValue('personalisation', []),
        });
    }

    onChange(event) {
        let values = this.state.values;

        if (event.target.checked) {
            values.push( event.target.value );
        } else {
            values = pull( values, event.target.value );
        }

        this.setState({
            values: values,
        });

        console.log( 'personalisation', values );

        return this.props.onChange(values);
    }

    checkbox(option, index) {
        const { label, value } = option;

        const id = `personalisation-${value}`;
        const isChecked = this.state.values.indexOf(value) !== -1;

        return (
            <div key={ index } className="components-checkbox-control">
                <input
                    id={ id }
                    className="components-checkbox-control__input"
                    type="checkbox"
                    value={ value }
                    onChange={ this.onChange }
                    checked={ isChecked }
                />

                <label className="components-checkbox-control__label" htmlFor={ id }>
                    { label }
                </label>
            </div>
        );
    }

    render() {
        return this.state.options.map( this.checkbox );
    }
}

Personalisation.propTypes = {
    values: PropTypes.array,
    onChange: PropTypes.func,
};

export default Personalisation;
