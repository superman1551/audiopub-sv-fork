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
    import type { ClientsideAudio } from "$lib/types";
    import SafeMarkdown from "./safe_markdown.svelte";
    import { t, locale } from "$lib/i18n";

    export let audio: ClientsideAudio;

    let favoritesText = "";
    let playsText = "";

    $: {
        $locale;
        const count = audio.favoriteCount || 0;
        favoritesText =
            count === 0
                ? t("audio.no_favorites")
                : count === 1
                ? t("audio.one_favorite")
                : t("audio.favorites", { count });

        const plays = audio.plays ?? 0;
        playsText =
            plays === 0
                ? t("plays.none")
                : plays === 1
                ? t("plays.one")
                : t("plays.many", { count: plays });
    }
</script>

<article class="audio-item">
    <h3>
        {#if audio.user && !audio.user.isTrusted}
            <span style="color: red">({t('audio.pending_review')})</span> |{" "}
        {/if}
        <a href={`/listen/${audio.id}`}>{audio.title}</a>
        <span class="stats"> | {playsText} | {favoritesText}</span>
    </h3>
    {#if audio.user}
        <p>
            {t('audio.by')} <a href={`/user/${audio.user.id}`}>{audio.user.displayName}</a>
        </p>
    {/if}
    <SafeMarkdown source={audio.description} />
</article>

<style>
    .audio-item {
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 10px;
    }

    h3 {
        margin: 0 0 8px 0;
    }

    .stats {
        color: #666;
        font-size: 0.9em;
        font-weight: normal;
        margin-left: 0.5em;
        white-space: nowrap;
    }
</style>
