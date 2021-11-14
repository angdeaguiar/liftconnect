// External Imports
import { useRecoilState } from 'recoil';

// Internal Imports
import userState from '../atoms/User';

const useUserState = () => {
	const [user, setUser] = useRecoilState(userState);

    const updateProperty = (key, value) => setUser({
		...user,
		[key]: value,
	});

	const updateProperties = props => setUser({
		...user,
		...props,
	});

	const resetProperties = () => setUser({});

	return {
        user,
        updateProperty,
        updateProperties,
		resetProperties,
	};
};

export default useUserState;
