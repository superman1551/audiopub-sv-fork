<!--
  This file is part of the audiopub project.
  
  Copyright (C) 2025 the-byte-bender
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.
  
  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
    import SvelteMarkdown from "@humanspeak/svelte-markdown";
    import {
        excludeRenderersOnly,
        buildUnsupportedHTML,
    } from "@humanspeak/svelte-markdown";
    import UntrustedLink from "./untrusted_link.svelte";

    export let source: string;

    // Convert @username to markdown links pointing to /u/username
    function linkifyMentions(text: string): string {
        if (!text) return text;
        // Replace occurrences not preceded by word char, to reduce emails/URLs impact
        // e.g., " hello @user" => " hello [@user](/u/user)"
        // usernames: 3-30 chars, letters, numbers, underscore
        return text.replace(/(^|[^a-zA-Z0-9_])@([a-zA-Z0-9_]{3,30})\b/g, (_match, p1, uname) => {
            return `${p1}[@${uname}](/u/${uname})`;
        });
    }

    $: processed = linkifyMentions(source);
</script>

<SvelteMarkdown
    source={processed}
    renderers={{
        ...excludeRenderersOnly(["heading", "image"]),
        html: buildUnsupportedHTML(),
        link: UntrustedLink,
    }}
    options={{
        gfm: true,
        breaks: true,
    }}
/>
