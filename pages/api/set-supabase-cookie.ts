import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../functions/supabase"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await supabase.auth.api.setAuthCookie(req, res);
}

export default handler