import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Login.css";


import {
    Box,
    Button,
    CheckBox,
    Grommet,
    Form,
    FormField,
    MaskedInput,
    RadioButtonGroup,
    RangeInput,
    Select,
    TextArea,
    TextInput,
    Text,
    Layer
  } from "grommet";
  import { grommet } from "grommet/themes";
  import { MailOption, Hide, View, Add, FormClose, StatusGood  } from 'grommet-icons';

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username:'',
            password:'',
            invalid: false
        };
    }

    handleInputChange = (value) => {
        if (Object.keys(value).length ==  0) {
            this.setState({
                username:'',
                password:'',
                invalid: false
            });
        }
        else {
            for ( var property in value ) {
                this.setState({[property]: value[property]});
            }
        }
    }
    
    setInvalid = (val) => {
        console.log(val);
        this.setState({invalid: val});
    }

    submit = () => {

        fetch('/api/signin', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                this.props.data.login();
                return res.json();
            } else {
                this.setInvalid(true);
            }
        })
        .then(data => {
            this.props.data.setName(data);
            this.props.history.push('/');
        }) 
        .catch(err => {
            console.error(err);
            alert('Error logging in please try again');
        });

        
    }

    componentDidMount() {
        
    }

    render() {
        var value = this.state;

        const onOpen = () => this.setInvalid(true);

        const onClose = () => this.setInvalid(undefined);

        return (
            <Grommet full theme={grommet}>
                <Box 
                    direction="column"
                    pad="large"
                    width="100vw"
                    height="100vh"
                >
                    <Form
                        value={value}
                        onChange={nextValue => this.handleInputChange(nextValue)}
                        onReset={() => this.handleInputChange({})}
                        onSubmit={({ value }) => {this.submit()}}
                    >
                        <FormField name="username" label="Username">
                            <TextInput name="username" />
                        </FormField>
                        <FormField name="password" label="Password">
                            <Box
                                direction="row"
                                align="center"
                                round="small"
                            >
                                <TextInput
                                    plain
                                    type={this.state.reveal ? "text" : "password"}
                                    name="password"
                                />
                                <Button
                                    icon={this.state.reveal ? <View size="medium" /> : <Hide size="medium" />}
                                    onClick={() => this.setReveal(!this.state.reveal)}
                                />
                            </Box>
                        </FormField>

                        {this.state.invalid && (
                            <Layer
                                position="bottom"
                                modal={false}
                                margin={{ vertical: "medium", horizontal: "small" }}
                                onEsc={onClose}
                                responsive={false}
                                plain
                            >
                                <Box
                                align="center"
                                direction="row"
                                gap="small"
                                justify="between"
                                round="medium"
                                elevation="medium"
                                pad={{ vertical: "xsmall", horizontal: "small" }}
                                background="status-critical"
                                >
                                <Box align="center" direction="row" gap="xsmall">
                                    <StatusGood />
                                    <Text size="small">Invalid username or password.</Text>
                                </Box>
                                <Button icon={<FormClose />} onClick={onClose} plain />
                                </Box>
                            </Layer>
                        )}
                        <Box direction="row" gap="medium" margin='large'>
                            <Button type="submit" primary label="Login" />
                            <Button type="reset" label="Reset" />
                        </Box>
                    </Form>

                </Box>
                
            </Grommet>
        );
    }
    
}

export default withRouter(Login);