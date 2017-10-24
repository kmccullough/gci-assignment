import React from 'react';

import userStore from '../store/user';
import userActions from "../action/user";
import User from "../model/user";


// Used below to edit a user row in place
class UserEditRow extends React.Component {
    constructor(props) {
        super(props);

        [ // Bind handlers
            'onUpdate',
            'onCancel',
            'onDone',
        ].map((c) => this[c] = this[c].bind(this));
    }

    onUpdate(field, event) {
        this.props.onUpdate
            && this.props.onUpdate(this.props.user, field, event.target.value);
    }

    onCancel() {
        this.props.onCancel
            && this.props.onCancel(this.props.user);
    }

    onDone() {
        this.props.onDone
            && this.props.onDone(this.props.user);
    }

    render() {
        return (
            <div className="c-users__user c-user c-user--edit">
                <div className="c-user__field c-user__field--edit c-user__field--first-name">
                    <input type="text" value={this.props.user.firstName || ''}
                           onChange={(e) => this.onUpdate('firstName', e)} />
                </div>
                <div className="c-user__field c-user__field--edit c-user__field--last-name">
                    <input type="text" value={this.props.user.lastName || ''}
                           onChange={(e) => this.onUpdate('lastName', e)} />
                </div>
                <div className="c-user__field c-user__field--edit c-user__field--address">
                    <input type="text" value={this.props.user.address || ''}
                           onChange={(e) => this.onUpdate('address', e)} />
                </div>
                <div className="c-user__field c-user__field--edit c-user__field--actions">
                    <button onClick={this.onCancel}>Cancel</button>
                    <button onClick={this.onDone}>Done</button>
                </div>
            </div>
        );
    }
}


// Used below to display a user row
class UserViewRow extends React.Component {
    constructor(props) {
        super(props);

        [ // Bind handlers
            'onEdit',
            'onRemove',
        ].map((c) => this[c] = this[c].bind(this));
    }

    onEdit() {
        this.props.onEdit
            && this.props.onEdit(this.props.user);
    }

    onRemove() {
        this.props.onRemove
            && this.props.onRemove(this.props.user);
    }

    render() {
        return (
            <div className="c-users__user c-user">
                <div className="c-user__field c-user__field--first-name"
                     title="First Name">{this.props.user.firstName}</div>
                <div className="c-user__field c-user__field--last-name"
                     title="Last Name">{this.props.user.lastName}</div>
                <div className="c-user__field c-user__field--address"
                     title="Address">{this.props.user.address}</div>
                <div className="c-user__field c-user__field--actions">
                    <button onClick={this.onEdit}>Edit</button>
                    <button onClick={this.onRemove}>Remove</button>
                </div>
            </div>
        );
    }
}


// Users list component with add/edit
class Users extends React.Component {
    constructor(props) {
        super(props);

        this._userStore = userStore;

        this.state = {
            users: this._userStore.getUsers()
        };

        [ // Bind handlers
            'onUserAdd',
            'onUserEditBegin',
            'onUserEditUpdate',
            'onUserEditCancel',
            'onUserEditEnd',
            'onUserRemove'
        ].map((c) => this[c] = this[c].bind(this));
    }

    componentDidMount() {
        // Listen for changes to the user store
        this._userStoreListener = this._userStore.addListener(
            () => this.setState({ users: this._userStore.getUsers() })
        );
    }

    componentWillUnmount() {
        // Remove user store listener
        this._userStoreListener && this._userStoreListener.remove();
    }

    // User wishes to add a new user record
    onUserAdd() {
        this.setState({
            editUser:   null,
            editedUser: new User({
                firstName: 'First Name',
                lastName:  'Last Name',
                address:   'Address'
            }),
        });
    }

    // User wishes to edit a user record
    onUserEditBegin(user) {
        this.setState({
            editUser:   user,
            editedUser: new User(user),
        });
    }

    // User updates the modified user record
    onUserEditUpdate(user, prop, value) {
        this.setState({
            editedUser: new User(
                Object.assign({},
                    this.state.editedUser,
                    { [prop]: value }
                )
            )
        });
    }

    // User wishes to cancel and discard updates to user record
    onUserEditCancel() {
        this.setState({ editUser: null, editedUser: null });
    }

    // User wishes to commit updates to user record
    onUserEditEnd(user) {
        const action = this.state.editUser
            ? {
                type: userActions.USER_REPLACE,
                oldUser: this.state.editUser,
                newUser: user
            }
            : {
                type: userActions.USER_ADD,
                user: user
            };
        this._userStore.getDispatcher().dispatch(action);
        this.setState({ editUser: null, editedUser: null });
    }

    // User wishes to remove user record
    onUserRemove(user) {
        this._userStore.getDispatcher().dispatch({
            type: userActions.USER_REMOVE,
            user: user
        });
    }

    render() {
        return (
            <div className="l-content l-content--users">
                <div className="c-users">
                    {
                        this.state.users.map((user, i) =>

                            user === this.state.editUser
                                ? <UserEditRow user={this.state.editedUser} key={i}
                                       onUpdate={this.onUserEditUpdate}
                                       onCancel={this.onUserEditCancel}
                                       onDone={this.onUserEditEnd} />
                                : <UserViewRow user={user} key={i}
                                       onEdit={this.onUserEditBegin}
                                       onRemove={this.onUserRemove} />
                        )
                    }
                    {
                        !this.state.editUser && this.state.editedUser
                            && <UserEditRow user={this.state.editedUser}
                                    onUpdate={this.onUserEditUpdate}
                                    onCancel={this.onUserEditCancel}
                                    onDone={this.onUserEditEnd} />
                    }
                    {
                        !this.state.editedUser && !this.state.users.length
                            && <div className="c-users__empty">No Users</div>
                    }
                </div>
                {
                    (!this.state.editedUser || this.state.editUser)
                        && <button className="c-buttons"
                                onClick={this.onUserAdd}>Add User</button>
                }
            </div>
        );
    }
}

export { Users as default };