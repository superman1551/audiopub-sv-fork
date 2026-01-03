<!--
  This file is part of the audiopub project.
  
  Copyright (C) 2024 the-byte-bender
  
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
    import title from "$lib/title";
    import AudioList from "$lib/components/audio_list.svelte";
    import type { PageData } from "./$types";
<<<<<<< HEAD
    import { t, locale } from "$lib/i18n";

    export let data: PageData;
    $: { $locale; title.set(t('title.home')); }

    $: sortDescription = (() => {
        const localeSignal = $locale;
        void localeSignal;
        let fieldKey = "home.field.date";
        switch (data.sortField) {
            case "createdAt":
                fieldKey = "home.field.date";
                break;
            case "plays":
                fieldKey = "home.field.playCount";
                break;
            case "favoriteCount":
                fieldKey = "home.field.favoriteCount";
                break;
            case "title":
                fieldKey = "home.field.title";
                break;
            case "random":
                fieldKey = "home.field.random";
                break;
            default:
                fieldKey = "home.field.date";
        }
        const orderKey =
            data.sortField === "random"
                ? ""
                : data.sortOrder === "DESC"
                  ? "home.order.word.desc"
                  : "home.order.word.asc";
        return `${t(fieldKey)} ${orderKey ? t(orderKey) : ""}`.trim();
    })();
</script>

<h1>{t('home.h1')}</h1>

<form method="GET" action="/">
    <label for="sort">{t('home.sortBy')}</label>
    <select name="sort" id="sort">
        <option value="createdAt" selected={data.sortField === "createdAt"}
            >{t('home.sort.date')}</option
        >
        <option value="plays" selected={data.sortField === "plays"}
            >{t('home.sort.playCount')}</option
        >
        <option value="favoriteCount" selected={data.sortField === "favoriteCount"}
            >{t('home.sort.favoriteCount')}</option
        >
        <option value="title" selected={data.sortField === "title"}
            >{t('home.sort.title')}</option
        >
        <option value="random" selected={data.sortField === "random"}
            >{t('home.sort.random')}</option
=======
    import { onMount } from "svelte";

    export let data: PageData;
    title.set("Home");

    $: sortDescription = (() => {
        let fieldDesc = "";
        switch (data.sortField) {
            case "createdAt":
                fieldDesc = "date";
                break;
            case "plays":
                fieldDesc = "play count";
                break;
            case "favoriteCount":
                fieldDesc = "favorite count";
                break;
            case "title":
                fieldDesc = "title";
                break;
            case "random":
                fieldDesc = "random";
                break;
            default:
                fieldDesc = "date";
        }
        const orderDesc =
            data.sortField === "random"
                ? ""
                : data.sortOrder === "DESC"
                  ? "descending"
                  : "ascending";
        return `${fieldDesc} ${orderDesc}`.trim();
    })();
</script>

<h1>Welcome to Audiopub</h1>

<form method="GET" action="/">
    <label for="sort">Sort by:</label>
    <select name="sort" id="sort">
        <option value="createdAt" selected={data.sortField === "createdAt"}
            >Date</option
        >
        <option value="plays" selected={data.sortField === "plays"}
            >Play Count</option
        >
        <option value="favoriteCount" selected={data.sortField === "favoriteCount"}
            >Favorite Count</option
        >
        <option value="title" selected={data.sortField === "title"}
            >Title</option
        >
        <option value="random" selected={data.sortField === "random"}
            >Random</option
>>>>>>> origin/main
        >
    </select>
    <br />
    {#if data.sortField !== "random"}
<<<<<<< HEAD
        <label for="order">{t('home.order')}</label>
        <select name="order" id="order">
            <option value="DESC" selected={data.sortOrder === "DESC"}
                >{t('home.order.desc')}</option
            >
            <option value="ASC" selected={data.sortOrder === "ASC"}
                >{t('home.order.asc')}</option
=======
        <label for="order">Order:</label>
        <select name="order" id="order">
            <option value="DESC" selected={data.sortOrder === "DESC"}
                >Descending</option
            >
            <option value="ASC" selected={data.sortOrder === "ASC"}
                >Ascending</option
>>>>>>> origin/main
            >
        </select>
        <br />
    {/if}
<<<<<<< HEAD
    <button type="submit">{t('home.sort.button')}</button>
</form>

<h2>{t('home.list.prefix')} {sortDescription}</h2>
=======
    <button type="submit">Sort</button>
</form>

<h2>Audio list sorted by {sortDescription}</h2>
>>>>>>> origin/main

<AudioList
    audios={data.audios}
    page={data.page}
    totalPages={data.totalPages}
<<<<<<< HEAD
=======
    currentUser={data.user}
>>>>>>> origin/main
    paginationBaseUrl={`/?sort=${data.sortField}${data.sortField === "random" ? "" : "&order=" + data.sortOrder}`}
/>
