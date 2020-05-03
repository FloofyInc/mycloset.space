import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import { grommet, Grommet, Anchor, Box, Button } from 'grommet';

import { Login, Notes, Logout } from "grommet-icons";
import "./Home.css";

import {Closet} from 'Pages';


class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            email:'',
            firstname:'',
            lastname:''
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
        this.setState(this.props.data);
    }

    render() {

        const customTheme = {
            global: {
              colors: {
                custom: "#cc6633"
              }
            }
        };

        return (
            <Grommet theme={customTheme}>
                {this.state.isLoggedIn ? 
                    
                    <Closet data={this.props.data}/>
                :
                    <Box
                        direction="column"
                        pad="small"
                        width="100vw"
                        height="100vh"
                        round="xxsmall"
                    >
                        <Box pad="small" width="100%" height="40%" />
                        <Box 
                            direction="column" 
                            justify="evenly" 
                            align="center"
                            pad="large"  
                            width="100%" 
                            height="40%"
                            gap="large"
                        > 
                            <Box pad="small" width="85%" height="25%"> 
                                <Link to="/register" style={{width: '100%', height: '100%'}}>
                                    <Button
                                        primary
                                        icon={<Notes />}
                                        label="Register"
                                        onClick={()=>{}}
                                        fill
                                        color="status-warning"
                                    />
                                </Link>
                            </Box>

                            <Box pad="small" width="85%" height="25%"> 
                                <Link to="/login" style={{width: '100%', height: '100%'}}>
                                    <Button
                                        primary
                                        icon={<Notes />}
                                        label="Login"
                                        onClick={()=>{}}
                                        fill
                                        color="status-ok"
                                    />
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                }
                
            </Grommet>
        );
    }
    
}

export default withRouter(Home);