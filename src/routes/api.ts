import { createHonoWithBindings } from "../global/fn/createHonoWithBindings";
// import postRouter from "./post"
import userRouter from "./user";
import LoginServiceRouter from "./services/LoginService";
import OutletServiceRouter from "./services/OutletService";
import ProductCategoryServiceRouter from "./services/ProductCategoryService";
import IngredientServiceRouter from "./services/IngredientService";
import ProductServiceRouter from "./services/ProductService";
import StockInventoryServiceRouter from "./services/StockInventoryService";
import FileUploadServiceRouter from "./services/FileUploadService";

const app = createHonoWithBindings();

// app.route("/posts", postRouter)
app.route("/users", userRouter);
app.route("/LoginService", LoginServiceRouter);
app.route("/OutletService", OutletServiceRouter);
app.route("/ProductCategoryService", ProductCategoryServiceRouter);
app.route("/IngredientService", IngredientServiceRouter);
app.route("/ProductService", ProductServiceRouter);
app.route("/StockInventoryService", StockInventoryServiceRouter);
app.route("/FileUploadService", FileUploadServiceRouter);

export default app;
