import bcrypt from "bcrypt";
import User from "./models/user-model.js";

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log("❌ Admin credentials missing in .env");
      return;
    }
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "ADMIN",
    });
    console.log("🔥 Admin seeded successfully");
  } catch (error) {
    console.error("❌ Seed admin error:", error.message);
  }
};

export default seedAdmin;
