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
    import title from "$lib/title";
    import type { ActionData } from "./$types";
<<<<<<< HEAD
    import { t, locale } from "$lib/i18n";
    $: { $locale; title.set(t('title.reset_password')); }
=======
    import { onMount } from "svelte";
    onMount(() => title.set("Reset Password"));
>>>>>>> origin/main
    export let data;

    export let form: ActionData;
</script>

<<<<<<< HEAD
<h1>{t('reset_password.h1')}</h1>

<p>{t('reset_password.text')}</p>
=======
<h1>Reset your password</h1>

<p>
    This is the last step. Just enter your new password and you're good to go.
</p>
>>>>>>> origin/main

<form use:enhance method="post">
    {#if form?.message}
        <div class="error-message" role="alert">
            {form.message}
        </div>
    {/if}

    <input type="hidden" name="token" value={data.token} />
    <div class="form-group">
<<<<<<< HEAD
        <label for="password">{t('reset_password.password')}</label>
=======
        <label for="password">New password</label>
>>>>>>> origin/main
        <input
            type="password"
            id="password"
            name="password"
<<<<<<< HEAD
            placeholder={t('reset_password.password')}
=======
            placeholder="New password"
>>>>>>> origin/main
            class="form-control"
            minlength="8"
            maxlength="64"
            required
<<<<<<< HEAD
        />
    </div>
    <button type="submit" class="btn">{t('reset_password.button')}</button>
=======
            autofocus
        />
    </div>
    <button type="submit" class="btn">Reset password</button>
>>>>>>> origin/main
</form>

<style>
    .error-message {
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 0.75rem;
        margin-bottom: 1rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 1rem;
        color: #333;
    }

    p {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #666;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #555;
    }

    .form-control {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease-in-out;
        width: 100%; /* Ensures input fills its container */
    }

    .form-control:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }

    .btn:hover {
        background-color: #0056b3;
    }
</style>
