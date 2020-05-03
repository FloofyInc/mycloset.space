import React, { Component } from 'react';
import './App.css';

import { Link, Route, Switch, BrowserRouter, BrowserHistory } from 'react-router-dom';
import { Box, Heading, Grommet, Anchor, Header, Nav, Avatar, Text } from 'grommet';

import {Home, Login, Logout, Register, Loading, History} from 'Pages';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:'',
            loading:true,
            isLoggedIn:false,
            email:'',
            firstname: '',
            lastname:''
        };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setName = this.setName.bind(this);
    }

    login() {
        this.setState({isLoggedIn: true});
    }

    logout() {
        this.setState({isLoggedIn: false});
        //this.history.push('/');
    }

    setEmail(tag) {
        this.setState({email: tag});
    }

    setName(data) {
        this.setState({firstname: data.firstname, lastname: data.lastname});
    }

    componentDidMount() {
        console.log("component did mount");
        fetch('/api/checkToken', {
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200) {
                return res.json();
            } else {
                this.setState({
                    msg: "PLEASE LOGIN FIRST.",
                    isLoggedIn:false,
                    loading:false
                });
            }
        })
        .then(data => {
            if (data) {
                //console.log(data);
                this.setState({
                    email: data.email,
                    msg: "USER LOGGED IN!",
                    isLoggedIn:true,
                    loading:false
                });
            }
            
        }) 
        .catch(err => {
            console.error(err);
            alert('Error checking token');
        });
        
    }

    render() {
        var propsData = {
            login: this.login,
            logout:this.logout,
            setEmail: this.setEmail,
            email:this.state.email,
            isLoggedIn: this.state.isLoggedIn,
            setName:this.setName
        };

        var content = this.state.loading ? <Loading /> :
            <Home data={propsData}/>

        return (
          <BrowserRouter history={BrowserHistory}>
                <Switch>
                    <Route exact path="/" component={() => 
                        content
                    }/>
                    <Route exact path="/login" component={() =>
                        <Login data={propsData}/>
                    }/>
                    <Route exact path="/logout" component={() =>
                        <Logout data={propsData}/>
                    }/>
                    <Route exact path="/register" component={() =>
                        <Register data={propsData}/>
                    }/>
                    }/>
                    <Route exact path="/history" component={() =>
                        <History data={propsData}/>
                    }/>
                    
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
