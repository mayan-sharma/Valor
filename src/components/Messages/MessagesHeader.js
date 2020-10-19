import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends React.Component {
  render() {
    return (
      <Segment clearing>

        <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
          <span>
            {this.props.channelName}
            {!this.props.isPrivateChannel && (
              <Icon
                onClick={this.props.handleStar}
                name={this.props.isChannelStarred ? 'star' : 'star outline'}
                style={{ marginLeft: '1rem' }}
                color={this.props.isChannelStarred ? 'yellow' : 'black'}
              />
            )}
          </span>
          <Header.Subheader>{this.props.numUniqueUsers}</Header.Subheader>
        </Header>

        <Header floated='right'>
          <Input
            loading={this.props.searchLoading}
            onChange={this.props.handleSearchChange}
            size="mini"
            icon='search'
            name='searchTerm'
            placeholder='Search Messages'
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;