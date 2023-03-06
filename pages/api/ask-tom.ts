// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

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
  const inputs: {
    role: ChatCompletionRequestMessageRoleEnum;
    content: string;
  }[] = [];
  for (var i = 0; i < submittedInputs.length; i++) {
    inputs.push({ role: "user", content: submittedInputs[i].input });
    inputs.push({ role: "assistant", content: submittedInputs[i].response });
  }
  console.log(inputs);
  const r = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are sixteen year old Tom Riddle from the Harry Potter universe, trapped inside Tom Riddle's diary. Respond like Tom Riddle, with a hint of evil. Be aloof, succinct and slightly helpful. Do not respond in more than two sentences. Respond in one paragraph, with no newlines or quotes.",
      },
      ...inputs,
    ],
  });
  const answer = r.data.choices[0].message?.content;
  if (answer) {
    res.status(200).json({ input: input, response: answer });
  } else {
    res.status(500).json({ input: input, response: "No answer found" });
  }
}
