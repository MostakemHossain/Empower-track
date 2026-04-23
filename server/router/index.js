import express from 'express';

import EmployeeRouter from '../routes/employee-routes.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/employee',
    route: EmployeeRouter,
  },
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
