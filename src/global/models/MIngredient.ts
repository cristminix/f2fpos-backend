import { ingredients, stock_inventory } from "../../db/schema";
import { and, eq, asc, desc, count } from "drizzle-orm";
import DrizzleModel from "./DrizzleModel";

class MIngredient extends DrizzleModel {
  schema = ingredients;

  async getListWithStock(
    outletId: number,
    limit: number,
    page: number,
    order: { [key: string]: "asc" | "desc" } | null,
  ) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the query with right join and select specific fields for flat object
    let query = this.db
      .select({
        // Ingredients fields
        id: this.schema.id,
        outletId: this.schema.outletId,
        name: this.schema.name,
        code: this.schema.code,
        // description: this.schema.description,
        unit: this.schema.unit,
        alternateUnit: this.schema.alternateUnit,
        // timestamp: this.schema.timestamp,
        // Stock inventory fields
        inventoryId: stock_inventory.id,
        // inventoryOutletId: stock_inventory.outletId,
        // itemId: stock_inventory.itemId,
        itemType: stock_inventory.itemType,
        minQty: stock_inventory.minQty,
        qty: stock_inventory.qty,
        // inventoryNotes: stock_inventory.notes,
        // inventoryTimestamp: stock_inventory.timestamp,
      })
      .from(this.schema)
      .leftJoin(stock_inventory, eq(this.schema.id, stock_inventory.itemId))
      .where(eq(this.schema.outletId, outletId));

    // Apply sorting
    if (order) {
      const sortField = Object.keys(order)[0];
      const sortOrder = order[sortField];

      if (sortField) {
        // Handle both original schema fields and joined fields
        let orderByField;
        if (this.schema[sortField as keyof typeof this.schema]) {
          // Field belongs to ingredients schema
          orderByField = this.schema[sortField as keyof typeof this.schema];
        } else if (stock_inventory[sortField as keyof typeof stock_inventory]) {
          // Field belongs to stock_inventory schema
          orderByField =
            stock_inventory[sortField as keyof typeof stock_inventory];
        }

        if (orderByField) {
          // console.log({ orderByField });
          query =
            sortOrder === "asc"
              ? query.orderBy(asc(orderByField))
              : query.orderBy(desc(orderByField));
        }
      }
    }

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const result = await query;

    // Get total count for pagination
    const totalCountResult = await this.db
      .select({ count: count() })
      .from(this.schema)
      .leftJoin(stock_inventory, eq(this.schema.id, stock_inventory.itemId))
      .where(eq(this.schema.outletId, outletId));

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      records: result,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
  getByNameAndOutletId(name: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.name, name), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }

  getByCodeAndOutletId(code: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.code, code), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }

  getByOutletId(outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.outletId, outletId));
  }
}

export default MIngredient;
