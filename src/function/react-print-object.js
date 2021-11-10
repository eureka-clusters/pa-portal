import React from "react";
export default class PrintObject extends React.PureComponent {
    render() {
        return (
            <pre style={{ textAlign: 'left' }}>
                {JSON.stringify(this.props.value, null, 2)}
            </pre>
        );
    }
}