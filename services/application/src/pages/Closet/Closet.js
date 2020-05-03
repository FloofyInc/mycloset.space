import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import { Box, Heading, Grommet } from 'grommet';
import "./Closet.css";

class Closet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
    }

    componentDidMount() {
        
    }

    render() {

        return (
            <div>
                <Link to="/logout" style={{width: '100%', height: '100%'}}>
                    Logout
                </Link>
            </div>
        );
    }
    
}

export default withRouter(Closet);