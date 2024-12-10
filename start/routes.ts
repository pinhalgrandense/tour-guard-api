/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.post("/login", "AuthController.login");
Route.post("/logout", "AuthController.logout").middleware("auth");

Route.group(() => {
  Route.get("/admins", "Admin/AdminController.index");
  Route.resource("/mines", "Admin/MinesController").apiOnly();
  Route.resource("/manager", "Admin/ManagersController").apiOnly();
})
  .prefix("admin")
  .middleware(["auth", "role:admin"]);

Route.group(() => {
  Route.get("/mines/:mine_id/regions", "Manager/RegionsController.index");
  Route.post("/mines/:mine_id/regions", "Manager/RegionsController.store");
  Route.get("/mines/:mine_id/regions/:id", "Manager/RegionsController.show");
  Route.put("/mines/:mine_id/regions/:id", "Manager/RegionsController.update");
  Route.delete(
    "/mines/:mine_id/regions/:id",
    "Manager/RegionsController.destroy"
  );
  Route.put("/mines/:id", "Manager/MinesController.update");
  Route.get("/mines", "Manager/MinesController.index");
  Route.get("/mines/:id", "Manager/MinesController.show");
  Route.resource("/managers", "Manager/ManagerController").apiOnly();

  Route.get("/mines/:mineId/regions", "Manager/RegionsController.index");
  Route.post("/mines/:mineId/regions", "Manager/RegionsController.store");
  Route.put("/regions/:id", "Manager/RegionsController.update");
  Route.delete("/regions/:id", "Manager/RegionsController.destroy");

  Route.get("/regions/:regionId/facts", "Manager/RegionFactsController.index");
  Route.post("/regions/:regionId/facts", "Manager/RegionFactsController.store");
  Route.put("/facts/:id", "Manager/RegionFactsController.update");
  Route.delete("/facts/:id", "Manager/RegionFactsController.destroy");
})
  .prefix("manager")
  .middleware(["auth", "role:manager"]);
