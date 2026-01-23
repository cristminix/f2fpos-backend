import { file_uploads } from "../../db/schema";
import DrizzleModel from "./DrizzleModel";
class MFileUpload extends DrizzleModel {
  schema = file_uploads;
}
export default MFileUpload;
