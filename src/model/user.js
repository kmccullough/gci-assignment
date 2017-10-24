import Model from './model';


class User extends Model {
    constructor(props) {
        super(props);
        this.copyProps([
            'firstName',
            'lastName',
            'address'
        ], props);
    }
}

export default User;