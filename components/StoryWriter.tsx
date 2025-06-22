"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";

const storiesPath = "app/data/stories"; // we are writing the stories to the server itself & we can also integrate db if wanted.

const StoryWriter = () => {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState("");
  const [events, setEvents] = useState<Frame[]>([]);

  function sanitizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphen
      .replace(/(^-|-$)+/g, ""); // Trim hyphens from start/end
  }

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const folderName = sanitizeTitle(story);
    const fullPath = `${storiesPath}/${folderName}`;

    const response = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: fullPath }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      handleStream(reader, decoder);
    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("Failed to start the streaming process ❌");
    }
  }
  //   async function runScript() {
  //     setRunStarted(true);
  //     setRunFinished(false);

  //     const response = await fetch("/api/run-script", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ story, pages, path: storiesPath }),
  //     });

  //     if (response.ok && response.body) {
  //       // Handling streams from API
  //       console.log("Streaming process has started ✅");
  //       const reader = response.body.getReader();
  //       const decoder = new TextDecoder();

  //       handleStream(reader, decoder);
  //     } else {
  //       setRunFinished(true);
  //       setRunStarted(false);
  //       console.error("Failed to start the streaming process ❌");
  //     }
  //   }

  async function handleStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) {
    // manage the stream from the API
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      //
      const chunk = decoder.decode(value, { stream: true });

      const eventData = chunk
        .split("\n\n")
        .filter((line) => line.startsWith("event:"))
        .map((line) => line.replace(/^event: /, ""));

      //
      eventData.forEach((data) => {
        try {
          const prasedData = JSON.parse(data);
          if (prasedData.type === "callProgress") {
            setProgress(
              prasedData.output[prasedData.output.length - 1].content
            );
            setCurrentTool(prasedData.tool?.description || "");
          } else if (prasedData.type === "callStart") {
            setCurrentTool(prasedData.tool?.description || "");
          } else if (prasedData.type === "callEnd") {
            setRunFinished(true);
            setRunStarted(false);
          } else {
            setEvents((prevEvents) => [...prevEvents, prasedData]);
          }
        } catch (error) {
          console.warn("Skipping malformed JSON chunk:", data);
        }
      });
    }
  }

  return (
    <div className="flex flex-col space-y-2  container p-2 ">
      <section className="flex-1 text-xs sm:text-sm flex flex-col border border-[#758BFD] rounded-md p-3 space-y-2">
        {/* text area */}
        <Textarea
          value={story}
          onChange={(e) => {
            setStory(e.target.value);
          }}
          placeholder="Eg: Write a story about an Agentic Robot and man become friends.... "
          className="focus-visible:border-[#758BFD] focus-visible:outline-none border text-sm border-[#AEB8FE] flex-1 text-[#27187E] "
        />
        <Select
          onValueChange={(value) => {
            setPages(parseInt(value));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Decide how long story should be .... " />
          </SelectTrigger>

          <SelectContent className="focus-visible:border-[#758BFD]  focus-visible:outline-none border border-[#AEB8FE] w-full  ">
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem
                className="text-[#27187E]"
                value={String(i + 1)}
                key={i}
              >
                {i + 1} Page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!story || !pages || runStarted}
          onClick={runScript}
          className="bg-[#FF8600] p-6 font-bold tracking-wide text-white hover:bg-[#e67600] "
        >
          Generate Story
        </Button>
      </section>
      {/* output */}
      <section className="flex-1 text-xs  sm:text-sm font-light  text-gray-200 ">
        <div className="flex flex-col-reverse w-full px-3 space-y-2 bg-gray-900 rounded-md  overflow-y-auto h-54  ">
          <div className="text-xs px-3 sm:text-sm  text-gray-400">
            {runFinished === null && (
              <>
                <p className=" animate-pulse ">
                  I'll make your words sound like a real story. Describe it
                  above...👆
                </p>
                {/* <br /> */}
              </>
            )}
            <span className="text-amber-50">{">>"}</span>
            {progress}
          </div>
          {/* current tool */}
          {currentTool && (
            <>
              <span className="">{"--- [Current Tool] ---"}</span>
              {currentTool}
            </>
          )}
          {/* Render event */}

          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index}>
                <span>{">>"}</span>
                {renderEventMessage(event)}
              </div>
            ))}
          </div>

          {runStarted && (
            <div>
              <span className="">
                {"--- [Generating story book for you...] ---"}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default StoryWriter;
