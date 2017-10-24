import { Store } from 'flux/utils';

import dispatcher from '../dispatcher';
import userActions from '../action/user';
import User from '../model/user';

/**
 * Add user to store at specified index
 * @param store Store to modify
 * @param user User to add
 * @param index Index in store to add user
 * @returns {boolean} Whether store was modified
 */
const addUser = (store, user, index) => {
    const maxIndex = store._users.length;
    index = !index && index !== 0 ? maxIndex
        : Math.max(0, Math.min(maxIndex, index));
    store._users.splice(index, 0, user);
    return true;
};

/**
 * Replace old user with new user in store
 * @param store Store to modify
 * @param oldUser User to remove
 * @param newUser User to replace with
 * @returns {boolean} Whether store was modified
 */
const replaceUser = (store, oldUser, newUser) => {
    const index = store._users.indexOf(oldUser);
    if (index >= 0) {
        store._users.splice(index, 1, newUser);
        return true;
    }
};

/**
 * Remove user from store
 * @param store Store to modify
 * @param user User to remove
 * @returns {boolean} Whether store was modified
 */
const removeUser = (store, user) => {
    const index = store._users.indexOf(user);
    if (index >= 0) {
        store._users.splice(index, 1);
        return true;
    }
};


class UserStore extends Store {
    constructor(dispatcher) {
        super(dispatcher);
        this._users = [];
    }

    __onDispatch(action) {
        switch(action.type) {
            case userActions.USER_ADD:
                this.__changed = addUser(this, action.user, action.index);
                break;
            case userActions.USER_REPLACE:
                this.__changed = replaceUser(this, action.oldUser, action.newUser);
                break;
            case userActions.USER_REMOVE:
                this.__changed = removeUser(this, action.user);
                break;
            default:
                return;
        }
    }

    getUsers() {
        return this._users;
    }
}

const userStore = new UserStore(dispatcher);

export default userStore;