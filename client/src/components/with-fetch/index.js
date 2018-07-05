import { Component, getWrapperDisplayName } from '@wordpress/element';

import { reduce, keys } from 'lodash';

function withFetch( mapPropsToData = {} ) {
    return ( OriginalComponent ) => {
        class WrappedComponent extends Component {
            constructor() {
                super( ...arguments );

                this.state = {
                    data: {},
                };

                this.dataCache = {};

                this.applyMapping = this.applyMapping.bind(this);
                this.fetchData = this.fetchData.bind(this);
            }

            componentWillMount() {
                this.applyMapping( this.props );
            }

            componentWillReceiveProps( nextProps ) {
                this.applyMapping( nextProps );
            }

            applyMapping(props) {
                let nextProps = mapPropsToData(props);

                nextProps = reduce( nextProps, ( result, path, propName ) => {
                    const promise = this.fetchData(path).then(data => {
                        return {
                            prop: propName,
                            data: data,
                        };
                    });

                    result.push(promise);

                    return result;
                }, []);

                Promise.all( nextProps ).then(response => {
                    const data = response.reduce((carry, item) => {
                        carry[item.prop] = item.data;

                        return carry;
                    }, {});

                    this.setState({ data: data, });
                });
            }

            fetchData(path) {
                if (this.dataCache[path]) {
                    return this.dataCache[path];
                }

                this.dataCache[path] = fetch(path, { credentials: 'same-origin' })
                    .then(response => response.json());

                return this.dataCache[path];
            }

            render() {
                return (
                    <OriginalComponent
                        { ...this.props }
                        { ...this.state.data }
                    />
                );
            }
        }

        WrappedComponent.displayName = getWrapperDisplayName( WrappedComponent, 'fetch' );

        return WrappedComponent;
    };
}

export default withFetch;
