import DrizzleModel from "./DrizzleModel"
import { products } from "../../db/schema"
import { eq, asc, desc, like, or, and } from "drizzle-orm"
import { productCategoryProducts } from "../../db/schema/product_category_products"
import { product_categories } from "../../db/schema/product_categories"
import { calculateTotalPages } from "../fn/calculateTotalPages"
import { calculateOffset } from "../fn/calculateOffset"

export class MProduct extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = products
  }

  async getBySku(sku: string) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.sku, sku))
    return result[0]
  }

  async getListWithCategory(
    _limit = 5,
    _page = 1,
    _order = null,
    _filter = null,
    _search = null,
  ) {
    let {
      limit,
      page,
      order,
      filter,
      search,
      orderBy,
      validSearch,
      searchType,
      searchField,
      searchQuery,
      hasFilter,
      hasSearch,
      hasPage,
      hasSearchAndFilter,
    } = this.getListParam(_limit, _page, _order, _filter, _search)

    const totalRecords = await this.countAll()
    const totalPages = calculateTotalPages(totalRecords, limit)

    let records = []

    const offset = calculateOffset(page, limit)

    // Build the base query with join
    let query = this.db
      .select({
        id: this.schema.id,
        name: this.schema.name,
        weight: this.schema.weight,
        price: this.schema.price,
        description: this.schema.description,
        sku: this.schema.sku,
        categoryName: product_categories.name,
        categoryId: product_categories.id,
      })
      .from(this.schema)
      .leftJoin(
        productCategoryProducts,
        eq(this.schema.id, productCategoryProducts.productId),
      )
      .leftJoin(
        product_categories,
        eq(productCategoryProducts.categoryId, product_categories.id),
      )

    // Apply conditions based on search and filter
    if (hasSearchAndFilter) {
      let condition = this.addQueryFilter(filter)
      const searchFields = this.getSearchFields()
      const searchCondition = this.addQuerySearch(searchFields, searchQuery)

      if (condition && searchCondition) {
        query = query.where(and(condition, searchCondition))
      }
    } else if (hasSearch) {
      if (searchType === "single") {
        query = query.where(like(this.schema[searchField], `%${searchQuery}%`))
      } else {
        const searchFields = this.getSearchFields()
        const searchCondition = this.addQuerySearch(searchFields, searchQuery)
        if (searchCondition) {
          query = query.where(searchCondition)
        }
      }
    } else if (hasFilter) {
      let condition = this.addQueryFilter(filter)
      if (condition) {
        query = query.where(condition)
      }
    }

    // Apply ordering
    query = query.orderBy(orderBy)

    // Apply pagination
    if (hasPage) {
      query = query.limit(limit).offset(offset)
    }

    records = await query

    return {
      limit,
      totalPages,
      totalRecords,
      recordCount: records.length,
      records,
    }
  }
}
