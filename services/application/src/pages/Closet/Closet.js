import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom';

import "./Closet.css";

import { grommet, Grommet, Anchor, Box, Button, Nav, Sidebar, Avatar} from 'grommet';
import { Login, Menu, Logout, Add, Close, Analytics, Chat, Clock, Configure, Help, Projects, StatusInfoSmall } from "grommet-icons";

class Closet extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            open: false
        };
        
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    setOpen = (val) => {
        console.log(val);
        this.setState({open: val});
    }

    onSubmit = (event) => {
        event.preventDefault();
    }

    componentDidMount() {
        
        
    }
    

    render() {

        return (
            <Grommet theme={grommet}>
                <Box
                    direction="column"
                    pad="small"
                    width="100vw"
                    height="100vh"
                    round="xxsmall"
                >
                    <Box pad="none" direction="row"  width="100%" height="100%"> 
                        {this.state.open && (
                            <Box width="150px" height="100%" background={{color:"accent-1"}}>
                                hello
                            </Box>
                        )}
                        <Box align="center" direction="row" width="50px" height="50px">
                            
                            <Button
                                icon={<Menu />}
                                align="center"
                                onClick={() => {this.setOpen(!this.state.open)}}
                                fill
                                color="#00de90"
                            />
                            
                        </Box>
                        
                    </Box>
                    <Box 
                        direction="column" 
                        justify="evenly" 
                        align="center"
                        pad="large"  
                        width="100%" 
                        gap="large"
                    > 
                        
                    </Box>
                </Box>
            </Grommet>
        );
    }
    
}

export default withRouter(Closet);