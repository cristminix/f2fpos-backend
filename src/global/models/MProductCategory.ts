import { product_categories, productCategoryImages } from "../../db/schema"
import { eq } from "drizzle-orm"
import DrizzleModel from "./DrizzleModel"
import { calculateTotalPages } from "../fn/calculateTotalPages"
import { calculateOffset } from "../fn/calculateOffset"

class MProductCategory extends DrizzleModel {
  schema = product_categories

  getByName(name: string) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.name, name))
      .get(0)
  }

  async getListWithImage(
    _limit = 5,
    _page = 1,
    _order = null,
    _filter = null,
    _search = null,
  ) {
    let {
      limit,
      page,
      orderBy,
      filter,
      hasFilter,
      hasPage,
    } = this.getListParam(_limit, _page, _order, _filter, _search)

    const totalRecords = await this.countAll()
    const totalPages = calculateTotalPages(totalRecords, limit)
    const offset = calculateOffset(page, limit)

    let query = this.db
      .select({
        id: this.schema.id,
        outletId: this.schema.outletId,
        name: this.schema.name,
        timestamp: this.schema.timestamp,
        imageKey: productCategoryImages.key,
      })
      .from(this.schema)
      .leftJoin(
        productCategoryImages,
        eq(this.schema.id, productCategoryImages.productCategoryId)
      )
      .orderBy(orderBy)

    if (hasFilter) {
      const condition = this.addQueryFilter(filter)
      query = query.where(condition)
    }

    if (hasPage) {
      query = query.limit(limit).offset(offset)
    }

    const records = await query

    return {
      limit,
      totalPages,
      totalRecords,
      recordCount: records.length,
      records,
    }
  }

}

export { MProductCategory }
