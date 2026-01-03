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
<<<<<<< HEAD
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
=======
    import { onMount } from "svelte";
    export let data;
    onMount(() => title.set(`${data.profileUser.displayName}'s Profile`));
</script>

<h1>{data.profileUser.displayName}'s Profile</h1>
>>>>>>> origin/main

<table>
    <tbody>
        <tr>
<<<<<<< HEAD
            <td>{t('user.username')}</td>
            <td>{data.profileUser.name}</td>
        </tr>
        <tr>
            <td>{t('user.display_name')}</td>
            <td>{data.profileUser.displayName}</td>
        </tr>
        <tr>
            <td>{t('user.uploads')}</td>
=======
            <td>Username</td>
            <td>{data.profileUser.name}</td>
        </tr>
        <tr>
            <td>Display Name</td>
            <td>{data.profileUser.displayName}</td>
        </tr>
        <tr>
            <td>Uploads</td>
>>>>>>> origin/main
            <td>{data.count}</td>
        </tr>
    </tbody>
</table>

{#if data.isAdmin}
    {#if !data.profileUser.isTrusted}
        <form use:enhance action="?/trust" method="post">
<<<<<<< HEAD
            <button type="submit">{t('user.trust')}</button>
=======
            <button type="submit">Trust</button>
>>>>>>> origin/main
        </form>
    {/if}

    <details>
<<<<<<< HEAD
        <summary>{t('user.admin_actions')}</summary>
        {#if !data.profileUser.isBanned}
            <form use:enhance action="?/ban" method="post">
                <label for="ban-reason">{t('user.reason')}</label>
                <input type="text" name="reason" id="ban-reason" required />
                <br />
                <label for="ban-message">{t('user.message')}</label>
                <textarea name="message" id="ban-message"></textarea>
                <button type="submit">{t('user.ban')}</button>
=======
        <summary>administrative actions</summary>
        {#if !data.profileUser.isBanned}
            <form use:enhance action="?/ban" method="post">
                <label for="ban-reason">Reason</label>
                <input type="text" name="reason" id="ban-reason" required />
                <br />
                <label for="ban-message">Message</label>
                <textarea name="message" id="ban-message"></textarea>
                <button type="submit">Ban</button>
>>>>>>> origin/main
            </form>
        {/if}
        <br />
        <form use:enhance action="?/warn" method="post">
<<<<<<< HEAD
            <label for="warn-reason">{t('user.reason')}</label>
            <input type="text" name="reason" id="warn-reason" required />
            <br />
            <label for="warn-message">{t('user.message')}</label>
            <textarea name="message" id="warn-message"></textarea>
            <button type="submit">{t('user.warn')}</button>
=======
            <label for="warn-reason">Reason</label>
            <input type="text" name="reason" id="warn-reason" required />
            <br />
            <label for="warn-message">Message</label>
            <textarea name="message" id="warn-message"></textarea>
            <button type="submit">Warn</button>
>>>>>>> origin/main
        </form>
    </details>
{/if}

<<<<<<< HEAD
<h2>{t('user.uploads_h2')}</h2>
=======
<h2>Uploads</h2>
>>>>>>> origin/main

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
<<<<<<< HEAD

    .user-bio {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
    }
=======
>>>>>>> origin/main
</style>
