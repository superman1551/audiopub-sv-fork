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
import fs from "fs/promises";
import path from "path";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Audio, Notification } from "$lib/server/database";
import { NotificationTargetType } from "$lib/types";
import transcode from "$lib/server/transcode";
import { availableLocales } from "$lib/i18n";
import sendEmail from "$lib/server/email";

export const load: PageServerLoad = (event) => {
    const user = event.locals.user;
    if (!user) {
        return redirect(303, "/login");
    }
};

export const actions: Actions = {
    default: async (event) => {
        const user = event.locals.user;
        if (!user) {
            return redirect(303, "/login");
        }
        if (user.isBanned) {
            return error(403, "You are banned");
        }
        if (!user.isVerified) {
            return error(403, "Please verify your email first.");
        }
        if (!user.isTrusted) {
            const userAudioCount = await Audio.count({
                where: { userId: user.id },
            });
            if (userAudioCount >= 1) {
                return error(
                    403,
                    "Please wait for your account to be reviewed."
                );
            }
        }
        const form = await event.request.formData();
        const file = form.get("file") as File;
        const title = form.get("title") as string;
        const description = form.get("description") as string;
        const languageRaw = (form.get("language") as string | null)?.trim().toLowerCase();
        
        if (!file) {
            return fail(400, { title, description, language: languageRaw });
        }
        if (!title) {
            return fail(400, { title, description, language: languageRaw });
        }
        if (title.length < 3 || title.length > 120) {
            return fail(400, { title, description, language: languageRaw });
        }
        if (description && description.length > 5000) {
            return fail(400, { title, description, language: languageRaw });
        }
        if (file.size > 1024 * 1024 * 500) {
            // 500 MB
            return fail(400, { title, description, language: languageRaw });
        }
        
        // Validate language: must be 'und' or in availableLocales
        const LOCALE_CODES = new Set(availableLocales.map((l) => l.code));
        const validLanguageCodes = new Set([...LOCALE_CODES, "und"]);
        
        if (!languageRaw || !validLanguageCodes.has(languageRaw)) {
            return fail(400, {
                errorKey: 'upload.error.invalid_language',
                title,
                description,
                language: languageRaw || '',
            });
        }
        
        const audio = await Audio.create({
            title,
            description,
            hasFile: true,
            userId: user.id,
            extension: path.extname(file.name),
            language: languageRaw,
        });
        // Ensure destination directory exists (e.g., ./audio)
        await fs.mkdir(path.dirname(audio.path), { recursive: true });
        const arr = await file.arrayBuffer();
        await fs.writeFile(audio.path, new Uint8Array(arr));

        // Transcode synchronously so we can surface errors to the user.
        try {
            await transcode(audio.path);
        } catch (e: any) {
            console.error("Transcode failed", e);
            // Notify admins if configured
            try {
                const admin = process.env.ADMIN_EMAIL;
                if (admin) {
                    await sendEmail(
                        admin,
                        "Audiopub: Transcode failed",
                        `<p>Transcoding failed on upload.</p>
                         <ul>
                           <li>Audio ID: ${audio.id}</li>
                           <li>User ID: ${user.id}</li>
                           <li>Error: ${String(e?.message || e)}</li>
                         </ul>`
                    );
                }
            } catch (notifyErr) {
                console.error("Failed to notify admin about transcode error", notifyErr);
            }

            // Clean up created entities and file
            try { await fs.unlink(audio.path); } catch {}
            try { await audio.destroy(); } catch {}

            // Return a friendly, localized error via key; preserve inputs
            const isFfmpegMissing = typeof e?.message === 'string' && /ffmpeg/i.test(e.message) && /not (recognized|found)/i.test(e.message);
            return fail(500, {
                errorKey: isFfmpegMissing ? 'upload.error.ffmpeg_missing' : 'upload.error.transcode',
                title,
                description,
                language: languageRaw || 'und',
            });
        }

        // Mentions in initial description (if any)
        if (description) {
            await Notification.createMentionsFromText(
                user.id,
                NotificationTargetType.audio,
                audio.id,
                description,
                { metadata: { audioId: audio.id, content: description.slice(0, 400) } }
            );
        }

        return redirect(303, `/listen/${audio.id}`);
    },
};
