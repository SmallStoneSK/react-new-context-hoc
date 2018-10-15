import React from 'react';

export const Provider = ({Provider}, store = {}) => WrappedComponent => {
  return class extends React.PureComponent {
    state = store;
    updateContext = newState => this.setState(newState);
    render() {
      return (
        <Provider value={{ ...this.state, updateContext: this.updateContext }}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  };
};

export const Consumer = ({Consumer}, relatedKeys = []) => WrappedComponent => {
  return class extends React.PureComponent {
    _version = 0;
    _context = {};
    getContext = data => {
      if (relatedKeys.length === 0) return data;
      [...relatedKeys, 'updateContext'].forEach(k => {
        if(this._context[k] !== data[k]) {
          this._version++;
          this._context[k] = data[k];
        }
      });
      return this._context;
    };
    render() {
      return (
        <Consumer>
          {data => {
            const newContext = this.getContext(data);
            const newProps = { context: newContext, _version: this._version, ...this.props };
            return <WrappedComponent {...newProps} />;
          }}
        </Consumer>
      );
    }
  };
};