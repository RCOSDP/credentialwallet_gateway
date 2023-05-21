import { NextApiRequest, NextApiResponse } from "next";
import session from "express-session";
import { connectMiddleware } from "./connect";

export type Session = { session: { [key: string]: any } };
const sessionStore = new session.MemoryStore();

const config = {
  saveUninitialized: true,
  secret: "keyboard cat",
  resave: false,
  store: sessionStore,
};

export const withSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await connectMiddleware(req, res, session(config));
};
