import { API_URL } from "@utils/index";
import axios from "axios";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Post request to backend
      const response = await axios.post(`${API_URL}/admin/login`, req.body);

      const { data } = response;

      // Set jwt token as cookie to the headers
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", JSON.stringify(data.token), {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: "strict",
          path: "/",
          secure: process.env.NODE_ENV !== "development",
        })
      );

      // Return the user data
      res.status(200).json(data);
    } catch (err: any) {
      console.log(err.response.data.message);
      res.status(401).json({ message: err.response.data.message });
    }
  } else {
    // If the request isn't a post request
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
