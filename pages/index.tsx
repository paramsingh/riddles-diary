import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import "animate.css";
import FadeIn from "@/components/FadeIn";
import FadeOut from "@/components/FadeOut";

export const FADE_IN_TIME = 2000;
export const FADE_OUT_TIME = 3000;
type InputResponse = {
  input: string;
  response: string;
};

const splitSentences = (text: string): string[] => {
  return text.match(/[^\.!\?]+[\.!\?]+/g)!;
};

export default function Home() {
  const [currentText, setCurrentText] = useState<string>(
    "Hello, my name is Tom Riddle."
  );
  const [showText, setShowText] = useState<boolean>(true);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("Type something here...");
  const [submittedInputs, setSubmittedInputs] = useState<InputResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const inputDiv = useRef<HTMLInputElement>(null);
  const [response, setResponse] = useState<string[]>([]);
  const submit = () => {
    setLoading(true);
    fetch("/api/ask-tom", {
      method: "POST",
      body: JSON.stringify({
        input: inputText,
        submittedInputs,
      }),
    }).then((res) => {
      res.json().then((data) => {
        var sentences = splitSentences(data.response);
        const firstSentence = sentences.shift()!;
        setCurrentText(firstSentence);
        setResponse(sentences);
        setSubmittedInputs([
          ...submittedInputs,
          { input: data.input, response: data.response },
        ]);
        setShowText(true);
        setShowInput(false);
        setLoading(false);
      });
    });
    setInputText("go again?");
  };

  useEffect(() => {
    setTimeout(() => {
      setShowText(false);
    }, FADE_IN_TIME);
    if (response.length === 0) {
      setTimeout(() => {
        setShowInput(true);
      }, FADE_IN_TIME + FADE_OUT_TIME);
    }
  }, [currentText]);

  useEffect(() => {
    if (response.length > 0) {
      setTimeout(() => {
        const sentence = response[0];
        setCurrentText(sentence);
        setResponse(response.slice(1));
        setShowText(true);
      }, FADE_IN_TIME + FADE_OUT_TIME);
    }
  }, [response]);

  return (
    <>
      <Head>
        <title>Tom Riddle&apos;s Diary</title>
        <meta
          name="description"
          content="Talk with Tom Riddle from Harry Potter"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.main}>
        {showText ? (
          <FadeIn>
            <h1
              style={{
                fontFamily: "Italianno, cursive",
                fontSize: "6vmin",
              }}
            >
              {currentText}
            </h1>
          </FadeIn>
        ) : (
          <FadeOut>
            <h1
              style={{
                fontFamily: "Italianno, cursive",
                fontSize: "6vmin",
              }}
            >
              {currentText}
            </h1>
          </FadeOut>
        )}
        {showInput && !loading && (
          <>
            <FadeIn>
              <textarea
                style={{
                  outline: "0px solid transparent",
                  fontFamily: "Patrick Hand",
                  fontSize: "4vw",
                  width: "100%",
                  height: "70vh",
                  flexBasis: "100%",
                  textAlign: "center",
                  border: "none",
                  background: "none",
                  overflow: "visible",
                }}
                spellCheck={false}
                onFocus={() => {
                  if (
                    inputText === "Type something here..." ||
                    inputText === "go again?"
                  )
                    setInputText("");
                }}
                color={
                  inputText === "Type something here..." ? "gray" : "white"
                }
                value={inputText}
                onChange={(e) => {
                  e.preventDefault();
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submit();
                  }
                }}
              ></textarea>
            </FadeIn>

            <button
              style={{
                outline: "none",
                boxShadow: "none",
                borderRadius: "0px",
                marginTop: "50px",
                width: "200px",
                height: "50px",
                background: "none",
                borderStyle: "solid",
                borderColor: "white",
                fontSize: "1.25vw",
                fontFamily: "Patrick Hand",
              }}
              onClick={(e) => {
                submit();
              }}
            >
              Go!
            </button>
          </>
        )}
      </main>
    </>
  );
}
