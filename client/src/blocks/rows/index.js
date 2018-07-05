import { times } from 'lodash';
import classnames from 'classnames';
import memoize from 'memize';

import { __, sprintf } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

import './style.scss';

import {
    InspectorControls,
    BlockControls,
    BlockAlignmentToolbar,
    InnerBlocks,
} from '@wordpress/blocks';


const getRowLayouts = memoize( ( rows ) => {
    return times( rows, ( n ) => ( {
        name: `row-${ n + 1 }`,
        label: sprintf( __( 'Row %d' ), n + 1 ),
        icon: 'rows',
    } ) );
} );

export const name = 'core/rows';

export const settings = {
    title: sprintf(
        __( '%1$s (%2$s)' ),
        __( 'Rows' ),
        __( 'Experimental' )
    ),

    icon: 'rows',

    category: 'layout',

    attributes: {
        rows: {
            type: 'number',
            default: 1,
        },

        align: {
            type: 'string',
        },
    },

    description: __( 'A multi-row layout of content.' ),

    getEditWrapperProps( attributes ) {
        const { align } = attributes;

        return { 'data-align': align };
    },

    edit( { attributes, setAttributes, className, focus } ) {
        const { align, rows } = attributes;
        const classes = classnames( className, `has-${ rows }-rows` );

        return [
            ...focus ? [
                <BlockControls key="controls">
                    <BlockAlignmentToolbar
                        controls={ [ 'wide', 'full' ] }
                        value={ align }
                        onChange={ ( nextAlign ) => {
                            setAttributes( { align: nextAlign } );
                        } }
                    />
                </BlockControls>,
                <InspectorControls key="inspector">
                    <RangeControl
                        label={ __( 'Rows' ) }
                        value={ rows }
                        onChange={ ( nextRows ) => {
                            setAttributes( {
                                rows: nextRows,
                            } );
                        } }
                        min={ 2 }
                        max={ 6 }
                    />
                </InspectorControls>,
            ] : [],
            <div className={ classes } key="container">
                <InnerBlocks layouts={ getRowLayouts( rows ) } />
            </div>,
        ];
    },

    save( { attributes } ) {
        const { rows } = attributes;

        return (
            <div className={ `has-${ rows }-rows` }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
