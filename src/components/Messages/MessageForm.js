import React from 'react'
import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";
import { v4 as uuidv4 } from 'uuid';
import firebase from "../../firebase";
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

class MessageForm extends React.Component {

  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    uploadTask: null,
    uploadState: '',
    percentageUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    error: '',
    modal: false,
    emojiPicker: false
  }

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleKeyDown = (e) => {

    if (e.ctrlKey && e.keyCode === 13) {
      this.sendMessage();
    }

    const { message, typingRef, channel, user } = this.state;

    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    }

    else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  }

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  }

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
    this.setState({ message: newMessage, emojiPicker: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  }

  colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }

      x = ":" + x + ":";
      return x;
    });
  };

  createMessage = (fileURL = null) => {
    const message = {
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }

    if (fileURL !== null) {
      message['image'] = fileURL;
    }
    else {
      message['content'] = this.state.message;
    }

    return message;
  }

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, typingRef, user } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', error: '' })
          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove()
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false, error: err.message })
        });
    }

    else {
      this.setState({ error: 'Add a message!' });
    }
  }

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private/${this.state.channel.id}`;
    }
    else {
      return 'chat/public';
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filepath = `${this.getPath()}/public/${uuidv4()}.jpg`;

    this.setState({
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filepath).put(file, metadata)
    },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentageUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          this.setState({ percentageUploaded });
        },
          err => {
            console.log(err);
            this.setState({
              error: err.message,
              uploadState: 'error',
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.sendFileMessage(downloadURL, ref, pathToUpload);
            })
              .catch(err => {
                console.log(err);
                this.setState({
                  error: err.message,
                  uploadState: 'error',
                  uploadTask: null
                });
              })
          }
        )
      }
    );
  }

  sendFileMessage = (downloadURL, ref, pathToUpload) => {
    ref.child(pathToUpload)
      .push()
      .set(this.createMessage(downloadURL))
      .then(() => {
        this.setState({ uploadState: 'done' })
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: err.message })
      })
  }

  render() {
    return (
      <Segment className="message_form">

        { this.state.emojiPicker && (
          <Picker
            set='apple'
            onSelect={this.handleAddEmoji}
            className='emojipicker'
            title='Pick your emoji'
            emoji='point_up'
          />
        )}

        <Input
          fluid
          name="message"
          className={this.state.error.includes('message') ? 'error' : ''}
          value={this.state.message}
          ref={node => (this.messageInputRef = node)}
          disabled={this.state.loading}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={this.state.emojiPicker ? 'close' : 'add'} onClick={this.handleTogglePicker} />}
          labelPosition="left"
          placeholder="Write your message"
        />

        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color={this.props.primaryColor}
            content='Message'
            labelPosition="left"
            icon="edit"
          />
          <Button
            onClick={this.openModal}
            disabled={this.state.uploadState === 'uploading'}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>

        <FileModal
          modal={this.state.modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentageUploaded={this.state.percentageUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;