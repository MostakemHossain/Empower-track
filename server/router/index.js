import express from 'express';

import EmployeeRouter from '../routes/employee-routes.js';
import AuthRoutes from '../routes/auth-routes.js';

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
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
