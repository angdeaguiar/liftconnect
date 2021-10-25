import { atom } from 'recoil';

const userState = atom({
	key: 'userState',
	default: {
        id: '',
		fname: '',
		lname: '',
        city: '',
		prs: {
			squat: 0,
			deadlift: 0,
			bench: 0
		}
	},
});

export default userState;
