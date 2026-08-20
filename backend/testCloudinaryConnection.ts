import cloudinary from "./lib/cloudinary";

try {
  const result = await cloudinary.api.ping();
  console.log(result);
} catch (e) {
  console.log(e);
}
