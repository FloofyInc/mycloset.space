import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import "./Register.css";

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

class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username:null,
            password:null,
            password2:null,
            email:null,
            firstname:null,
            lastname:null,
            location:'Earth',
            dob:null,
            reveal: false,
            message: null,
            invalid: false
        };
    }

    handleInputChange = (value) => {
        if (Object.keys(value).length ==  0) {
            this.setState({
                username:null,
                password:null,
                password2:null,
                email:null,
                firstname:null,
                lastname:null,
                location:'Earth',
                dob:null,
                reveal: false,
                message: null,
            });
        }
        else {
            for ( var property in value ) {
                this.setState({[property]: value[property]});
            }
        }
    }

    setReveal = (val) => {
        this.setState({reveal: val});
    }

    setInvalid = (val) => {
        console.log(val);
        this.setState({invalid: val});
    }

    submit = () => {
        if (this.state.password != this.state.password2) {
            this.setState({message: "Password does not match."});
        }
        else {
            this.setState({message: null});
            var ncount = 0;
            for (var prop in this.state) {
                if (this.state[prop] == null) {
                    ncount++;
                }
            }
            
            if (ncount > 1) {
                this.setInvalid(true);
            }
            else {
                fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    this.setState({working:false});
                    if (res.status === 200) {
    
                        this.props.data.login();
                        return res.json();
                    } else {
                        const error = new Error(res.error);
                        throw error;
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
        }
    }

    componentDidMount() {
        
    }

    render() {
        var value = this.state;
        const emailMask = [
            {
                regexp: /^[\w\-_.]+$/,
                placeholder: 'example',
            },
            { fixed: '@' },
            {
                regexp: /^[\w]+$/,
                placeholder: 'my',
            },
            { fixed: '.' },
            {
                regexp: /^[\w]+$/,
                placeholder: 'com',
            },
        ];
        const daysInMonth = month => new Date(2019, month, 0).getDate();
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
                        <FormField name="password2" label="Confirm Password">
                            <Box
                                direction="row"
                                align="center"
                                round="small"
                            >
                                <TextInput
                                    plain
                                    type={this.state.reveal ? "text" : "password"}
                                    name="password2"
                                />
                                <Button
                                    icon={this.state.reveal ? <View size="medium" /> : <Hide size="medium" />}
                                    onClick={() => this.setReveal(!this.state.reveal)}
                                />
                            </Box>
                        </FormField>
                        {this.state.message && (
                            <Box pad={{ horizontal: "small" }}>
                                <Text color="status-error">{this.state.message}</Text>
                            </Box>
                        )}
                        <FormField name="email" label="Email">
                        <MaskedInput
                            icon={<MailOption />}
                            mask={emailMask}
                            name="email"
                        />
                        </FormField>
                        <FormField name="firstname" label="First Name">
                            <TextInput name="firstname" />
                        </FormField>
                        <FormField name="lastname" label="Last Name">
                            <TextInput name="lastname" />
                        </FormField>
                        <FormField name="dob" label="Date of Birth">
                            <MaskedInput
                                mask={[
                                {
                                    length: [1, 2],
                                    options: Array.from({ length: 12 }, (v, k) => k + 1),
                                    regexp: /^1[0,1-2]$|^0?[1-9]$|^0$/,
                                    placeholder: "mm"
                                },
                                { fixed: "/" },
                                {
                                    length: [1, 2],
                                    options: Array.from(
                                    {
                                        length: daysInMonth(parseInt(this.state.dob != null ? this.state.dob.split("/")[0] : "", 10))
                                    },
                                    (v, k) => k + 1
                                    ),
                                    regexp: /^[1-2][0-9]$|^3[0-1]$|^0?[1-9]$|^0$/,
                                    placeholder: "dd"
                                },
                                { fixed: "/" },
                                {
                                    length: 4,
                                    options: Array.from({ length: 100 }, (v, k) => 2019 - k),
                                    regexp: /^[1-2]$|^19$|^20$|^19[0-9]$|^20[0-9]$|^19[0-9][0-9]$|^20[0-9][0-9]$/,
                                    placeholder: "yyyy"
                                }
                                ]}
                                name="dob"
                            />
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
                                    <Text size="small">Fill out all fields!</Text>
                                </Box>
                                <Button icon={<FormClose />} onClick={onClose} plain />
                                </Box>
                            </Layer>
                        )}
                        <Box direction="row" gap="medium" margin='large'>
                            <Button type="submit" primary label="Register" color="#00de90"/>
                            <Button type="reset" label="Reset" color="#00de90"/>
                        </Box>
                    </Form>

                </Box>
                
            </Grommet>
        );
      }
    
}

export default withRouter(Register);