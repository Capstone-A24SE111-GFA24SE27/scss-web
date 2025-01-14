import { ReactNode } from 'react';
import { Scrollbar } from '@shared/components';


type PageSimple = {
	innerScroll?: boolean;
	children?: ReactNode;
};

function PageSimpleSidebarContent(props: PageSimple) {
	const { innerScroll, children } = props;

	if (!children) {
		return null;
	}

	return (
		<Scrollbar>
			<div className="PageSimple-sidebarContent">{children}</div>
		</Scrollbar>
	);
}

export default PageSimpleSidebarContent;
