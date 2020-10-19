import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from 'md5';

class Register extends React.Component {

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    error: '',
    loading: false,
    usersRef: firebase.database().ref('users'),
  };

  inputErrorHandler = (inputName) => {
    return this.state.error.toLowerCase().includes(inputName) ? 'error' : '';
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation;
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    }
    else if (password !== passwordConfirmation) return false;
    else return true;
  }

  isFormValid = () => {
    let error;

    if (this.isFormEmpty(this.state)) {
      error = 'Fill in all fields!';
      this.setState({ error });
      return false;
    }
    else if (!this.isPasswordValid(this.state)) {
      error = 'Invalid password!';
      this.setState({ error });
      return false;
    }
    else return true;
  }

  saveUser = user => {
    this.state.usersRef.child(user.uid).set({
      name: user.displayName,
      avatar: user.photoURL
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.isFormValid()) {
      this.setState({ error: '', loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          console.log(res);
          res.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(res.user.email)}?d=identicon`
          })
            .then(() => {
              this.saveUser(res.user);
              this.setState({ loading: false });
            })
            .then(() => console.log("User Saved!"))
            .catch(err => {
              console.log(err);
              this.setState({ error: err.message, loading: false });
            })
        })
        .catch(err => {
          console.log(err);
          this.setState({ error: err.message, loading: false })
        });
    }
  }

  render() {

    const { username, email, password, passwordConfirmation, error, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="purple" textAlign="center">
            <Icon name="address card outline" color="purple" />
            Register
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                className={this.inputErrorHandler('username')}
                value={username}
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text" />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                className={this.inputErrorHandler('email')}
                value={email}
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                className={this.inputErrorHandler('password')}
                value={password}
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                value={passwordConfirmation}
                icon="repeat"
                className={this.inputErrorHandler('password')}
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
              />

              <Button disabled={loading} className={loading ? 'loading' : ''} color="purple" fluid size="large">
                Register
              </Button>
            </Segment>
          </Form>
          {error.length > 0 &&
            <Message error>{error}</Message>
          }
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
