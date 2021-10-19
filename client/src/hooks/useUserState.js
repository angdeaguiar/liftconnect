import { useRecoilState } from 'recoil';
import userState from '../atoms/User';

export default (() => {
	const [user, setUser] = useRecoilState(userState);

    const updateProperty = (key, value) => setUser({
		...user,
		[key]: value,
	});

	const updateProperties = props => setUser({
		...user,
		...props,
	});

	return {
        user,
        updateProperty,
        updateProperties,
	};
});
