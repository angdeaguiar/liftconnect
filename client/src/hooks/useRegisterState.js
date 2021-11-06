import { useRecoilState } from 'recoil';
import registerState from '../atoms/Register';

const useRegiserState = () => {
	const [register, setRegister] = useRecoilState(registerState);

    const updateProperty = (key, value) => setRegister({
		...register,
		[key]: value,
	});

	const updateProperties = props => setRegister({
		...register,
		...props,
	});

	return {
        register,
        updateProperty,
        updateProperties,
	};
};

export default useRegiserState;