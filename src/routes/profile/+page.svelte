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
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";
    import type { ActionData } from "./$types";
    import AudioList from "$lib/components/audio_list.svelte";
    import title from "$lib/title";
    import { t, locale, availableLocales } from "$lib/i18n";
    $: { $locale; title.set(t('title.profile')); }

    export let data: PageData;
    export let form: ActionData;
</script>

<h1>{t('profile.h1')}</h1>

<form use:enhance method="POST">
    {#if form?.message}
        <div class="error-message" role="alert">
            {form.message}
        </div>
    {/if}

    <fieldset>
        <legend>{t('profile.account_details')}</legend>
        
        <label for="email">{t('profile.email')}:</label>
        <input type="email" id="email" name="email" value={data.email} />
        
        <label for="displayName">{t('profile.display_name')}:</label>
        <input
            type="text"
            id="displayName"
            name="displayName"
            value={data.displayName}
            minlength="3"
            maxlength="30"
        />
        
        <label for="password">{t('profile.new_password')}:</label>
        <input
            type="password"
            id="password"
            name="password"
            minlength="8"
            maxlength="64"
        />
    </fieldset>

    <fieldset>
        <legend>{t('profile.content_prefs')}</legend>
        
        <label for="bio">{t('profile.bio')}:</label>
        <textarea
            id="bio"
            name="bio"
            rows="4"
            maxlength="500"
            class="form-control"
            placeholder={t('profile.bio_placeholder')}
        >{data.profileUser?.bio || ''}</textarea>
        
        <div class="language-prefs">
            <p id="langHint">{t('profile.lang_hint')}</p>
            <div role="group" aria-labelledby="langHint" class="language-checkboxes">
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        name="preferredLanguages" 
                        value="und"
                        checked={data.profileUser?.preferredLanguages?.includes('und')}
                    />
                    {t('upload.language_unknown')}
                </label>
                {#each availableLocales as lang}
                    <label class="checkbox-label">
                        <input 
                            type="checkbox" 
                            name="preferredLanguages" 
                            value={lang.code}
                            checked={data.profileUser?.preferredLanguages?.includes(lang.code)}
                        />
                        {lang.nativeName}
                    </label>
                {/each}
            </div>
            <small class="help">{t('profile.lang_help')}</small>
        </div>
    </fieldset>

    <button type="submit">{t('profile.update')}</button>
</form>

<h2>{t('profile.uploads')}</h2>

<AudioList
    audios={data.audios}
    groupThreshold={0}
    page={data.page}
    totalPages={data.totalPages}
    paginationBaseUrl={`/profile`}
/>

<style>
    .error-message {
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 0.75rem;
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: fit-content;
        margin: auto;
    }

    label {
        font-weight: bold;
    }

    input[type="text"],
    input[type="email"] {
        padding: 0.5rem;
        border: 1px solid #ccc;
    }

    button {
        background-color: #333;
        color: #fff;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #444;
    }

    fieldset {
        border: 1px solid #ddd;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
    }

    legend {
        font-weight: bold;
        padding: 0 0.5rem;
    }

    textarea.form-control {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: inherit;
        resize: vertical;
    }

    .language-prefs {
        margin-top: 1rem;
    }

    .language-checkboxes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 0.5rem 0;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .help {
        color: #666;
        font-size: 0.9rem;
        font-style: italic;
    }
</style>
