import { Router, Request, Response } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { RemoveUserController } from './controllers/user/RemoveUserController';

import { isRoleType4 } from './middlewares/isRoleType4';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { ListByRoleController } from './controllers/role/ListByRoleController';
import { UpdateUserController } from './controllers/user/UpdatedUserController';
import { ListByUserController } from './controllers/user/ListByUserController';
import { CreateProductController } from './controllers/product/CreateProductController';
import { CreateGroupController } from './controllers/group/CreateGroupController';
import { CreateIngredientController } from './controllers/ingredient/CreateIngredientController';
import { ListByIngredientsController } from './controllers/ingredient/ListByIngredientsController';
import { ListByGroupsController } from './controllers/group/ListByGroupsController';
import { CreateProductIngredientController } from './controllers/product_ingredient/CreateProductIngredientController';
import { CreateSalesController } from './controllers/sales/CreateSalesController';
import { CreateMovimentEntryController } from './controllers/moviment/CreateMovimentEntryController';
import { ListByMovimentController } from './controllers/moviment/ListByMovimentController';
import { CreateMovimentExitController } from './controllers/moviment/CreateMovimentExitController';
import { CreateRequestController } from './controllers/request/CreateRequestController';
import { CreateReturnRequestController } from './controllers/request/CreateReturnRequestController';
import { ListByRequestController } from './controllers/request/ListByRequestController';
import { ListByReturnRequestController } from './controllers/request/ListByReturnRequestController';
import { DetailRequestController } from './controllers/request/DetailRequestService';
import { ListByProductController } from './controllers/product/ListByProductController';
import { UpdatedUserPasswordAdminController } from './controllers/user/UpdatedUserPasswordAdminController';
import { CreateLocationController } from './controllers/location/CreateLocationController';
import { UpdateLocationController } from './controllers/location/UpdateLocationController';
import { ListByLocationController } from './controllers/location/ListByLocationController';
import { RemoveLocationController } from './controllers/location/RemoveLocationController';
import { UpdateGroupController } from './controllers/group/UpdateGroupController';
import { RemoveGroupController } from './controllers/group/RemoveGroupController';
import { UpdateProductController } from './controllers/product/UpdateProductController';
import { RemoveProductIngredientController } from './controllers/product_ingredient/RemoveProductIngredientController';
import { RemoveProductController } from './controllers/product/RemoveProductController';
import { RemoveIngredientController } from './controllers/ingredient/RemoveIngredienteController';
import { UpdateIngredientController } from './controllers/ingredient/UpdateIngredientController';

const router = Router();

//ROTAS USER
router.post('/user', isAuthenticated, isRoleType4, new CreateUserController().handle)
router.delete('/remove/user', isAuthenticated, isRoleType4, new RemoveUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/update/user', isAuthenticated, isRoleType4, new UpdateUserController().handle);
router.get('/users', isAuthenticated, isRoleType4, new ListByUserController().handle);

router.put('/update/password/admin', isAuthenticated, isRoleType4, new UpdatedUserPasswordAdminController().handle);

//ROTAS ROLE
router.get('/roles', isAuthenticated, isRoleType4, new ListByRoleController().handle);

//ROTAS PRODUTO
router.post('/product', isAuthenticated, isRoleType4, new CreateProductController().handle);
router.get('/products', isAuthenticated, isRoleType4, new ListByProductController().handle);
router.post('/product/ingredient', isAuthenticated, isRoleType4, new CreateProductIngredientController().handle);
router.delete('/remove/product/ingredient', isAuthenticated, isRoleType4, new RemoveProductIngredientController().handle);
router.put('/update/product', isAuthenticated, isRoleType4, new UpdateProductController().handle);
router.delete('/remove/product', isAuthenticated, isRoleType4, new RemoveProductController().handle);

//ROTAS GRUPO
router.post('/group', isAuthenticated, isRoleType4, new CreateGroupController().handle);
router.get('/groups', isAuthenticated, isRoleType4, new ListByGroupsController().handle);
router.put('/update/group', isAuthenticated, isRoleType4, new UpdateGroupController().handle);
router.delete('/remove/group', isAuthenticated, isRoleType4, new RemoveGroupController().handle);

//ROTAS INGREDIENTE
router.post('/ingredient', isAuthenticated, isRoleType4, new CreateIngredientController().handle);
router.get('/ingredients', isAuthenticated, isRoleType4, new ListByIngredientsController().handle);
router.delete('/remove/ingredient', isAuthenticated, isRoleType4, new RemoveIngredientController().handle);
router.put('/update/ingredient', isAuthenticated, isRoleType4, new UpdateIngredientController().handle);

//ROTAS VENDAS
router.post('/sale', isAuthenticated, isRoleType4, new CreateSalesController().handle);

//ROTAS MOVIMENT
router.post('/moviment/entry', isAuthenticated, isRoleType4, new CreateMovimentEntryController().handle);
router.post('/moviment/exit', isAuthenticated, isRoleType4, new CreateMovimentExitController().handle);
router.get('/moviments', isAuthenticated, isRoleType4, new ListByMovimentController().handle);

//ROTAS REQUEST
router.post('/request', isAuthenticated, isRoleType4, new CreateRequestController().handle);
router.post('/request/return', isAuthenticated, isRoleType4, new CreateReturnRequestController().handle);
router.get('/requests', isAuthenticated, isRoleType4, new ListByRequestController().handle);
router.get('/requests/return', isAuthenticated, isRoleType4, new ListByReturnRequestController().handle);
router.get('/request/detail', isAuthenticated, isRoleType4, new DetailRequestController().handle);

//ROTAS LOCATION
router.post('/location', isAuthenticated, isRoleType4, new CreateLocationController().handle);
router.put('/update/location', isAuthenticated, isRoleType4, new UpdateLocationController().handle);
router.get('/locations', isAuthenticated, isRoleType4, new ListByLocationController().handle);
router.delete('/remove/location', isAuthenticated, isRoleType4, new RemoveLocationController().handle);

export default router;