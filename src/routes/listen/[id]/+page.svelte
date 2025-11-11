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
    import Modal from "$lib/components/modal.svelte";
    import title from "$lib/title";
    import SafeMarkdown from "$lib/components/safe_markdown.svelte";
    import AudioActions from "$lib/components/audio_actions.svelte";
    import { t, locale, availableLocales } from "$lib/i18n";
    
    let isDeleteAudioModalVisible: boolean = false;
    let isEditAudioModalVisible: boolean = false;
    let editDescription: string = "";

    onMount(() => {
        title.set(data.audio.title);
        editDescription = data.audio.description || "";
    });
    
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

    // Language label resolution
    const LANGUAGE_MAP = new Map(availableLocales.map((l) => [l.code, l.nativeName] as const));
    $: audioLanguageLabel = (() => {
        const localeSignal = $locale;
        void localeSignal;
        if (data.audio.language === 'und') return t('upload.language_unknown');
        return LANGUAGE_MAP.get(data.audio.language) || data.audio.language;
    })();
</script>

<h1>{data.audio.title}</h1>

<div class="audio-player">
    <audio controls id="player" on:play={handlePlay}>
        <source src="/{data.audio.path}" type={data.mimeType} />
        <source src="/{data.audio.transcodedPath}" type="audio/aac" />
        <p>{t('listen.no_audio_support')}</p>
    </audio>
</div>

<div class="audio-details">
    <div class="audio-stats">
        <span>{playsText}</span>
        <span>{favoritesString}</span>
    </div>
    <AudioActions
        context="listen"
        currentUser={data.user}
        audioId={data.audio.id}
        audioTitle={data.audio.title}
        audioPath={data.audio.path}
        isFavorited={data.audio.isFavorited}
        favoriteCount={data.audio.favoriteCount ?? 0}
        showFollow={!!(data.user && data.audio.user && data.audio.user.id !== data.user.id)}
        isFollowing={data.isFollowing}
    />
    {#if data.audio.user}
        <p>
            {t('listen.uploaded_by')}: <a href="/user/{data.audio.user.id}"
                >{data.audio.user.name}</a
            >
        </p>
    {/if}
    <p>{t('listen.language')}: {audioLanguageLabel}</p>
    <p>{t('listen.upload_date')}: {new Date(data.audio.createdAt).toLocaleDateString()}</p>
    {#if data.audio.description}
        <h2>{t('listen.description')}:</h2>
        <SafeMarkdown source={data.audio.description} />
    {/if}

    {#if data.user && (data.isAdmin || data.user.id === data.audio.user?.id)}
        <div class="owner-actions">
            <button type="button" on:click={() => { isEditAudioModalVisible = true; editDescription = data.audio.description || ""; }}>
                {t('common.edit')}
            </button>
            <Modal ariaLabel={t('listen.edit_description_aria')} bind:visible={isEditAudioModalVisible}>
                <h2>{t('listen.edit_description_title')}</h2>
                <form
                  use:enhance={(enhanceArgs) => {
                    return async ({ result, update }) => {
                      await update(result);
                      isEditAudioModalVisible = false;
                    };
                  }}
                  action="?/edit_audio" method="POST">
                    <label for="description">{t('listen.edit_description_label')}</label>
                    <textarea id="description" name="description" rows="6" bind:value={editDescription} maxlength="4000"></textarea>
                    <div class="modal-actions">
                        <button type="button" on:click={() => (isEditAudioModalVisible = false)}>{t('common.cancel')}</button>
                        <button type="submit">{t('common.confirm')}</button>
                    </div>
                </form>
            </Modal>
        </div>
        <button type="button" on:click={() => isDeleteAudioModalVisible = true}>
            {t('listen.delete')}
        </button>
        <Modal ariaLabel={t('listen.delete_confirm_aria')} bind:visible={isDeleteAudioModalVisible}>
            <h2>{t('listen.delete_confirm_title')}</h2>
            <p>{t('listen.delete_confirm')}</p>
            <form action="?/delete" method="POST">
                <div class="modal-actions">
                    <button type="button" on:click={() => isDeleteAudioModalVisible = false}>{t('common.cancel')}</button>
                    <button type="submit">{t('common.confirm')}</button>
                </div>
            </form>
        </Modal>
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
