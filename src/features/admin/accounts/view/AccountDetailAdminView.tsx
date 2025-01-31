import { useNavigate, useParams } from 'react-router-dom';
import CounselorAccountAdminView from './CounselorAccountAdminView';
import GenericAccountAdminView from './GenericAccountAdminView';
import StudentAccountAdminView from './StudentAccountAdminView';

const AccountDetailAdminView = () => {
	const { id, role } = useParams();
	const navigate = useNavigate();
	

	let view = null;

	switch (role) {
		case 'a-counselor': {
			view = <CounselorAccountAdminView id={id} />;
			break;
		}
		case 'na-counselor': {
			view = <CounselorAccountAdminView id={id} />;
			break;
		}
		case 'manager': {
			view = <GenericAccountAdminView id={id} />;
			break;
		}
		case 'staff': {
			view = <GenericAccountAdminView id={id} />;
			break;
		}
		case 'student': {
			view = <StudentAccountAdminView id={id} />;
			break;
		}
		default: {
			navigate(-1);
			break;
		}
	}

	return (
		<div className='flex flex-col w-full h-full overflow-hidden'>
			

				{view}
		</div>
	);
};

export default AccountDetailAdminView;
