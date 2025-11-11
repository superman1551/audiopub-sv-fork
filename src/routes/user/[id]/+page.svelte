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
    import { enhance } from "$app/forms";
    import AudioList from "$lib/components/audio_list.svelte";
    import title from "$lib/title.js";
    import { t, locale } from "$lib/i18n";
    import SafeMarkdown from "$lib/components/safe_markdown.svelte";
    export let data;
    $: { $locale; title.set(t('title.user_profile', { name: data.profileUser.displayName })); }
</script>

<h1>{data.profileUser.displayName}'s {t('user.profile')}</h1>

{#if data.profileUser.bio}
    <div class="user-bio">
        <SafeMarkdown source={data.profileUser.bio} />
    </div>
{/if}

<table>
    <tbody>
        <tr>
            <td>{t('user.username')}</td>
            <td>{data.profileUser.name}</td>
        </tr>
        <tr>
            <td>{t('user.display_name')}</td>
            <td>{data.profileUser.displayName}</td>
        </tr>
        <tr>
            <td>{t('user.uploads')}</td>
            <td>{data.count}</td>
        </tr>
    </tbody>
</table>

{#if data.isAdmin}
    {#if !data.profileUser.isTrusted}
        <form use:enhance action="?/trust" method="post">
            <button type="submit">{t('user.trust')}</button>
        </form>
    {/if}

    <details>
        <summary>{t('user.admin_actions')}</summary>
        {#if !data.profileUser.isBanned}
            <form use:enhance action="?/ban" method="post">
                <label for="ban-reason">{t('user.reason')}</label>
                <input type="text" name="reason" id="ban-reason" required />
                <br />
                <label for="ban-message">{t('user.message')}</label>
                <textarea name="message" id="ban-message"></textarea>
                <button type="submit">{t('user.ban')}</button>
            </form>
        {/if}
        <br />
        <form use:enhance action="?/warn" method="post">
            <label for="warn-reason">{t('user.reason')}</label>
            <input type="text" name="reason" id="warn-reason" required />
            <br />
            <label for="warn-message">{t('user.message')}</label>
            <textarea name="message" id="warn-message"></textarea>
            <button type="submit">{t('user.warn')}</button>
        </form>
    </details>
{/if}

<h2>{t('user.uploads_h2')}</h2>

<AudioList
    audios={data.audios}
    groupThreshold={0}
    page={data.page}
    totalPages={data.totalPages}
    paginationBaseUrl={`/user/${data.profileUser.id}`}
/>

<style>
    details {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    summary {
        cursor: pointer;
        font-weight: bold;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    label {
        font-weight: bold;
    }

    input[type="text"],
    textarea {
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

    .user-bio {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
</style>
