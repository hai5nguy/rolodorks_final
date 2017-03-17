import React from 'react';

class Root extends React.Component {
    static propTypes = {
        children: React.PropTypes.element
    }
    render() {
        return (
            <div>
                <div>I am root</div>
                {/*You can stick NavBar here if ALL ROUTES will have a navbar*/}
                {this.props.children}
            </div>
        );
    }
}

export default Root;