import { ApiError } from "../utils/ApiError";
import prisma from "../utils/prismClient.js";

const isAuthenticated = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json(
          new ApiError(401, "Session Expired Please login again!", [
            "Unauthorized",
          ])
        );
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findFirst({
      where: {
        id: decodeToken.userId,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(ApiError(401, "User not authenticated", ["Unauthorized"]));
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", err));
  }
};

export default isAuthenticated;
