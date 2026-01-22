userData content example are:
{
  username: "demo",
  email: "demo@example.com",
  password: "password",
  roles: ["group:owner"],
  displayName: "Lalisa Mano",
  avatar:
    "https://i.pinimg.com/736x/c0/5b/a5/c05ba59a93d4e7ca51cafd2575a21b84.jpg",
}

1. check for username exist
2. check for email already in use
3. `username`,`email`,`password`  must be handled by MUser
3. `roles` must be handled by MUserRole 
4. `displayName` and `avatar` must be handled by MUserInfo
