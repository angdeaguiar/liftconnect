import { atom } from 'recoil';

const registerState = atom({
        key: 'registerState',
	default: {
                fname: '',
                lname: '',
                email: '',
                password: '',
                city: '',
                pronouns: '',
	},
});

export default registerState;