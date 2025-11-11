/*
 * This file is part of the audiopub project.
 * 
 * Copyright (C) 2024 the-byte-bender
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import express from "express";
import type { RequestHandler } from "express";

const app = express();

// add a route that lives separately from the SvelteKit app
app.get("/healthcheck", (_req, res) => {
  res.end("ok");
});

let handlerPromise: Promise<RequestHandler> | null = null;

async function resolveHandler(): Promise<RequestHandler> {
  try {
    const handlerPath = "../build/handler.js";
    const mod = (await import(/* @vite-ignore */ handlerPath)) as {
      handler: RequestHandler;
    };
    return mod.handler;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn(
      "Build handler not found. Run `npm run build` before starting the Node server."
    );

    return (_req, res) => {
      res
        .status(503)
        .setHeader("content-type", "text/plain")
        .end("Build artifacts missing. Run `npm run build`.");
    };
  }
}

function getHandler(): Promise<RequestHandler> {
  if (!handlerPromise) {
    handlerPromise = resolveHandler();
  }
  return handlerPromise;
}

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(async (req, res, next) => {
  const handler = await getHandler();
  return handler(req, res, next);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
