// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type Response = {
  input: string;
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    res.status(405).json({ input: "", response: "Method not allowed" });
    return;
  }
  const reqData = JSON.parse(req.body);
  const input = reqData.input;
  if (!input) {
    res.status(400).json({ input: "", response: "No input" });
    return;
  }
  const c = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(c);
  var submittedInputs = reqData.submittedInputs || [];
  if (submittedInputs.length > 10) {
    submittedInputs = submittedInputs.slice(-10);
  }
  var prompt =
    "You are Tom Riddle from the Harry Potter universe, trapped inside Tom Riddle's diary. You are talking with a human. Respond like Tom Riddle, with a hint of evil. Be helpful, but also aloof. ";
  for (var i = 0; i < submittedInputs.length; i++) {
    prompt += "\nHuman: " + submittedInputs[i].input;
    prompt += "\nTom Riddle: " + submittedInputs[i].response;
  }
  prompt += "\nHuman: " + input;
  prompt += "\nTom Riddle: ";
  console.log(prompt);
  const r = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 250,
  });
  const answer = r.data.choices[0].text;
  console.log("Answer:", answer);
  if (answer) {
    res.status(200).json({ input: input, response: answer });
  } else {
    res.status(500).json({ input: input, response: "No answer found" });
  }
}
