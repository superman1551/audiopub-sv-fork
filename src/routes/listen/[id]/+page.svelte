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
    export let data;

    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import CommentList from "$lib/components/comment_list.svelte";
    import title from "$lib/title";
    import SafeMarkdown from "$lib/components/safe_markdown.svelte";
    import { t, locale } from "$lib/i18n";
    onMount(() => title.set(data.audio.title));
    const handlePlay = () => {
        fetch(`/listen/${data.audio.id}/try_register_play`, { method: "POST" });
    };

    $: favoritesString = (() => {
        const localeSignal = $locale;
        void localeSignal;
        const count = data.audio.favoriteCount || 0;
        if (count === 0) return t('audio.no_favorites');
        if (count === 1) return t('audio.one_favorite');
        return t('audio.favorites', { count });
    })();

    $: playsText = (() => {
        const localeSignal = $locale;
        void localeSignal;
        const count = data.audio.plays || 0;
        if (count <= 0) return t('plays.none');
        if (count === 1) return t('plays.one');
        return t('plays.many', { count });
    })();
</script>

<h1>{data.audio.title}</h1>

<div class="audio-player">
    <audio controls id="player" on:play={handlePlay}>
        <source src="/{data.audio.path}" type={data.mimeType} />
        <source src="/{data.audio.transcodedPath}" type="audio/aac" />
        <p>{t('listen.no_audio_support')}</p>
    </audio>
    <a
        href="/{data.audio.path}"
        download={data.audio.title +
            (data.audio.extension.startsWith(".")
                ? data.audio.extension
                : "." + data.audio.extension)}
    >
    {t('listen.download')}
    </a>
</div>

<div class="audio-details">
    <div class="audio-stats">
        <span>{playsText}</span>
        <span>{favoritesString}</span>
        {#if data.user}
            <form
                use:enhance
                action={data.audio.isFavorited ? "?/unfavorite" : "?/favorite"}
                method="POST"
                class="favorite-form"
            >
                <button
                    type="submit"
                    class="favorite-button"
                    class:favorited={data.audio.isFavorited}
                >
                    <svg
                        class="heart-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {data.audio.isFavorited ? t('listen.unfavorite') : t('listen.favorite')}
                </button>
            </form>
        {/if}
    </div>
    {#if data.audio.user}
        <p>
            {t('listen.uploaded_by')}: <a href="/user/{data.audio.user.id}"
                >{data.audio.user.name}</a
            >
        </p>
    {/if}
    <p>{t('listen.upload_date')}: {new Date(data.audio.createdAt).toLocaleDateString()}</p>
    {#if data.user}
        {#if data.audio.user && data.audio.user.id !== data.user.id}
            {#if data.isFollowing}
                <form use:enhance action="?/unfollow" method="POST">
                    <button type="submit"
                        >{t('listen.unfollow')}</button
                    >
                </form>
            {:else}
                <form use:enhance action="?/follow" method="POST">
                    <button type="submit"
                        >{t('listen.follow')}</button
                    >
                </form>
            {/if}
        {/if}
    {/if}
    {#if data.audio.description}
        <h2>{t('listen.description')}:</h2>
        <SafeMarkdown source={data.audio.description} />
    {/if}

    {#if data.user && (data.isAdmin || data.user.id === data.audio.user?.id)}
        <form
            use:enhance={({
                formElement,
                formData,
                action,
                cancel,
                submitter,
            }) => {
                if (!confirm("Are you sure you want to delete this audio?")) {
                    cancel();
                }
            }}
            action="?/delete"
            method="POST"
        >
            <button type="submit"> Permanently delete</button>
        </form>
    {/if}

    <CommentList
        comments={data.comments}
        isAdmin={data.isAdmin}
        user={data.user ?? undefined}
    />

    {#if data.user && !data.user.isBanned}
        {#if !data.user.isTrusted}
            <p role="alert">
                {t('listen.not_trusted_warning')}
            </p>
        {/if}
        <form use:enhance action="?/add_comment" method="POST">
            <label for="comment">{t('listen.add_comment')}:</label>
            <textarea name="comment" id="comment" required maxlength="4000"
            ></textarea>
            <button type="submit">{t('listen.submit')}</button>
        </form>
    {/if}
</div>

<style>
    /* Styling for the main title */
    h1 {
        text-align: center;
        margin-bottom: 1rem;
        color: #333;
    }

    /* Styling for the audio player section */
    .audio-player {
        margin-bottom: 1rem;
    }

    /* Styling for the audio controls */
    audio {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    /* Styling for the download link */
    .audio-player a {
        display: block;
        text-align: center;
        margin-top: 0.5rem;
        color: #007bff;
        text-decoration: none;
        font-weight: bold;
    }

    /* Styling for the audio details section */
    .audio-details {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        background-color: #f9f9f9;
    }

    /* Styling for the audio stats (plays and favorites) */
    .audio-stats {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
    }

    .audio-stats span {
        font-weight: 500;
        color: #666;
    }

    /* Favorite button styling */
    .favorite-button {
        display: flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        color: #666;
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .favorite-button:hover {
        border-color: #ff6b6b;
        color: #ff6b6b;
        background-color: rgba(255, 107, 107, 0.1);
    }

    .favorite-button.favorited {
        color: #ff6b6b;
        border-color: #ff6b6b;
        background-color: rgba(255, 107, 107, 0.1);
    }

    .favorite-button .heart-icon {
        flex-shrink: 0;
    }

    /* Styling for the uploaded by link */
    .audio-details a {
        color: #007bff;
        text-decoration: none;
    }

    /* Styling for the description section */
    .audio-details h2 {
        margin-top: 1rem;
        color: #333;
    }

    /* Styling for the delete and move buttons */
    .audio-details form {
        margin-top: 1rem;
    }

    .audio-details button {
        margin-right: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .audio-details button:hover {
        background-color: #0056b3;
    }

    /* Styling for the comment section */
    .audio-details form textarea {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
    }

    .audio-details form button[type="submit"] {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .audio-details form button[type="submit"]:hover {
        background-color: #0056b3;
    }
</style>
