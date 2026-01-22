# Variable Definitions

- `schema_name`: product_category
- `columns`: ["id","name"]
- `primary_key`: id
- `service_name` : ProductCategoryService

# Schema Creation Command

add schema with name `{schema_name}` the columns only contains {columns} where {primary_key} as pk

# Model Creation Command

create model class for this schema with `M` prefix based on camel case of table name `src/global/models`

# Service Route Creation Command

create api route with basic crud operation on `src/routes/services/{service_name}.ts` then attach route file `/{{service_name}}` to `src/routes/api.ts`
