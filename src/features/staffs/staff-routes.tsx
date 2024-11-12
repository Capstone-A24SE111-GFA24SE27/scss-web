import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { specialRoutes } from '@shared/configs';
import { demandRoutes } from './demands';
import { staffStudentRoutes } from './students';
import { recommendedStudentsRoutes } from './recommends';
import { profileRoutes, settingsRoutes } from '@/shared/pages';

const StaffLayout = lazy(() => import('./staff-layout'));

export const supportStaffRoutes: RouteObject[] = [
	{
		path: '/',
		element: <StaffLayout />,
		children: [
			...specialRoutes,
			...demandRoutes,
			...staffStudentRoutes,
			...profileRoutes,
			...settingsRoutes
			// ...recommendedStudentsRoutes
		],
	},
];
