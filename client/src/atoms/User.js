import { atom } from 'recoil';

const userState = atom({
	key: 'userState',
	default: {
        id: '',
		fname: '',
		lname: '',
        city: ''
	},
});

export default userState;
