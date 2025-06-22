// // This API route receives a story prompt, number of pages, and save path from the client,
// // runs a GPTScript (.gpt file) to generate a children's story and illustrations,
// // and streams real-time progress back to the client using Server-Sent Events (SSE).

import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();
  console.log("Story:", story);
  console.log("Pages:", pages);
  console.log("Path:", path);

  const opts: RunOpts = {
    disableCache: true,
    input: `-- story ${story} -- pages ${pages} -- path ${path} -- `,
  };

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await g.run(script, opts);
          run.on(RunEventType.Event, (data) => {
            controller.enqueue(
              encoder.encode(`event: ${JSON.stringify(data)}\n\n`)
            );
          });
          await run.text();
          controller.close();
        } catch (error) {
          controller.error(error);
          console.error("Error in stream start:", error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// import { NextRequest } from "next/server";
// import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
// import g from "@/lib/gptScriptInstance";

// const script = "app/api/run-script/story-book.gpt";

// export async function POST(request: NextRequest) {
//   const { story, pages, path } = await request.json();
//   console.log(story, pages, path);

//   const opts: RunOpts = {
//     disableCache: true,
//     input: `-- story ${story} -- pages ${pages} -- path ${path} -- `,
//   };

//   //   streaming the information from gpt script via api endpoint into the client
//   try {
//     const encoder = new TextEncoder();
//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           const run = await g.run(script, opts);
//           run.on(RunEventType.Event, (data) => {
//             controller.enqueue(
//               encoder.encode(`event: ${JSON.stringify(data)}\n\n`)
//             );
//           });
//           await run.text();
//           controller.close();
//         } catch (error) {
//           controller.error(error);
//           console.log("Error in start", error);
//         }
//       },
//     });

//     return new Response(stream, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         Connection: "keep-alive",
//       },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
