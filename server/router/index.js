import express from 'express';

import EmployeeRouter from '../routes/employee-routes.js';
import AuthRoutes from '../routes/auth-routes.js';
import ProfileRoutes from '../routes/profile-routes.js';
import AttendanceRoute from '../routes/attendance-route.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/employee',
    route: EmployeeRouter,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:"/profile",
    route: ProfileRoutes
  },
  {
    path:"/attendance",
    route: AttendanceRoute,
  }
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
