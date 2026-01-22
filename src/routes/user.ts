import { createHonoWithBindings } from "../global/fn/createHonoWithBindings";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { users, user_roles, user_info } from "../db/schema";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { encryptPassword } from "../global/fn/encryptPassword";
import MUser from "../global/models/MUser";
import MUserRole from "../global/models/MUserRole";
import MUserInfo from "../global/models/MUserInfo";

// Define validation schemas
const createUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.string()).optional().default(["group:user"]),
  displayName: z.string().optional(),
  avatar: z.string().url().optional(),
});

const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roles: z.array(z.string()).optional(),
  displayName: z.string().optional(),
  avatar: z.string().url().optional(),
});

const app = createHonoWithBindings();

// GET all users
app.get("/", async (c) => {
  //@ts-ignore
  const jwt = c.get("jwt");
  console.log({ jwt });
  const db = drizzle(c.env.DB);
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users)
    .all();
  return c.json({
    success: true,
    users: result,
  });
});

// GET single user by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const db = drizzle(c.env.DB);

  const user = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, id))
    .get();

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  return c.json({
    success: true,
    user: user,
  });
});

// POST create new user
app.post("/", zBodyValidator(createUserSchema), async (c) => {
  const userData = c.req.valid("form");
  const db = drizzle(c.env.DB);
  const currentTimeStamp = Date.now().toString();
  // Create model instances with context
  const mUser = new MUser(c);
  const mUserRole = new MUserRole(c);
  const mUserInfo = new MUserInfo(c);

  // Check if username already exists
  const existingUsernameUser = await db
    .select()
    .from(users)
    .where(eq(users.username, userData.username))
    .get();

  if (existingUsernameUser) {
    return c.json({ success: false, message: "Username already exists" }, 409);
  }

  // Check if email already exists
  const existingEmailUser = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email))
    .get();

  if (existingEmailUser) {
    return c.json({ success: false, message: "Email already exists" }, 409);
  }

  // Hash password before storing
  const hashedPassword = await encryptPassword(
    userData.password,
    c.env.JWT_SECRET,
  );

  let createUserSuccess = false;
  let createUserRoleSuccess = false;
  let createUserInfoSuccess = false;
  let newUser;
  try {
    // Create the user record using MUser model
    const [newUserRow] = await mUser.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      timestamp: currentTimeStamp,
    });
    newUser = newUserRow;
    console.log(newUser);
    createUserSuccess = true;
  } catch (e) {
    console.error(e);
  }
  if (createUserSuccess) {
    try {
      // Handle roles using MUserRole model
      if (userData.roles && userData.roles.length > 0) {
        await mUserRole.create({
          userId: newUser.id,
          roles: JSON.stringify(userData.roles), // Store roles as JSON string
          timestamp: currentTimeStamp,
        });
      } else {
        // Default role if none provided
        await mUserRole.create({
          userId: newUser.id,
          roles: JSON.stringify(["group:user"]), // Default role
          timestamp: currentTimeStamp,
        });
      }
      createUserRoleSuccess = true;
    } catch (e) {
      console.error(e);
      await mUser.delete(newUser.id, {});
    }
    try {
      // Handle display name and avatar using MUserInfo model
      if (userData.displayName || userData.avatar) {
        await mUserInfo.create({
          userId: newUser.id,
          displayName: userData.displayName || null,
          avatar: userData.avatar || null,
          timestamp: currentTimeStamp,
        });
      }
    } catch (e) {
      console.error(e);
      await mUserRole.deleteWhere("userId", newUser.id);

      await mUser.delete(newUser.id, {});
    }
  }

  return c.json(
    {
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    },
    201,
  );
});

// PUT update user by ID
app.put("/:id", zBodyValidator(updateUserSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const updateData = c.req.valid("form");
  const db = drizzle(c.env.DB);

  // Create model instances with context
  const mUser = new MUser(c);
  const mUserRole = new MUserRole(c);
  const mUserInfo = new MUserInfo(c);

  // Check if user exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .get();

  if (!existingUser) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  // Check if email is being updated and if it already exists for another user
  if (updateData.email && updateData.email !== existingUser.email) {
    const emailExists = await db
      .select()
      .from(users)
      .where(eq(users.email, updateData.email))
      .get();

    if (emailExists) {
      return c.json({ success: false, message: "Email already exists" }, 409);
    }
  }

  // Check if username is being updated and if it already exists for another user
  if (updateData.username && updateData.username !== existingUser.username) {
    const usernameExists = await db
      .select()
      .from(users)
      .where(eq(users.username, updateData.username))
      .get();

    if (usernameExists) {
      return c.json(
        { success: false, message: "Username already exists" },
        409,
      );
    }
  }

  // Prepare update values
  let updatedValues: any = {};

  // Add fields that are being updated
  if (updateData.username) updatedValues.username = updateData.username;
  if (updateData.email) updatedValues.email = updateData.email;
  if (updateData.password) {
    updatedValues.password = await encryptPassword(
      updateData.password,
      c.env.JWT_SECRET,
    );
  }

  // Update user data if there are changes
  if (Object.keys(updatedValues).length > 0) {
    await mUser.update(id, updatedValues);
  }

  // Handle roles update
  if (updateData.roles && updateData.roles.length > 0) {
    const existingUserRole = await mUserRole.getRowByUserId(id);
    if (existingUserRole) {
      // Update existing roles
      await mUserRole.update(existingUserRole.id, {
        roles: JSON.stringify(updateData.roles),
      });
    } else {
      // Create new roles entry
      await mUserRole.create({
        userId: id,
        roles: JSON.stringify(updateData.roles),
      });
    }
  }

  // Handle userInfo update (displayName, avatar)
  if (updateData.displayName !== undefined || updateData.avatar !== undefined) {
    const existingUserInfo = await mUserInfo.getRowByUserId(id);
    const userInfoUpdates: any = {};

    if (updateData.displayName !== undefined) {
      userInfoUpdates.displayName = updateData.displayName;
    }
    if (updateData.avatar !== undefined) {
      userInfoUpdates.avatar = updateData.avatar;
    }

    if (existingUserInfo) {
      // Update existing userInfo
      await mUserInfo.update(existingUserInfo.id, userInfoUpdates);
    } else {
      // Create new userInfo
      await mUserInfo.create({
        userId: id,
        displayName: userInfoUpdates.displayName || null,
        avatar: userInfoUpdates.avatar || null,
      });
    }
  }

  // Return updated user info
  const [updatedUser] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, id));

  return c.json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

// DELETE user by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const db = drizzle(c.env.DB);

  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .get();

  if (!deletedUser) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  return c.json({
    success: true,
    message: "User deleted successfully",
    user: deletedUser,
  });
});

export default app;
