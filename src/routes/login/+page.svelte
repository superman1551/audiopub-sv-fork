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

    export let form: ActionData;
    $: { $locale; title.set(t('title.login')); }
</script>

<h1>{t('login.h1')}</h1>
=======
    import { onMount } from "svelte";

    export let form: ActionData;

    onMount(() => title.set("Login"));
</script>

<h1>Login</h1>
>>>>>>> origin/main

<form use:enhance method="POST">
    {#if form?.message}
        <div class="error-message" role="alert">
            {form.message}
        </div>
    {/if}

    <div class="form-group">
<<<<<<< HEAD
        <label for="email">{t('login.email')}:</label>
=======
        <label for="email">Email:</label>
>>>>>>> origin/main
        <input
            type="email"
            id="email"
            name="email"
            required
<<<<<<< HEAD
=======
            autofocus
>>>>>>> origin/main
            class="form-control"
        />
    </div>
    <div class="form-group">
<<<<<<< HEAD
        <label for="password">{t('login.password')}:</label>
=======
        <label for="password">Password:</label>
>>>>>>> origin/main
        <input
            type="password"
            id="password"
            name="password"
            required
            class="form-control"
        />
    </div>
<<<<<<< HEAD
    <button type="submit" class="btn">{t('login.button')}</button>
</form>
<div class="links">
    <a href="/forgot_password">{t('login.forgot')}</a>
    <a href="/register">{t('login.no_account')}</a>
=======
    <button type="submit" class="btn">Login</button>
</form>
<div class="links">
    <a href="/forgot_password">Forgot your password?</a>
    <a href="/register">Don't have an account? Register here</a>
>>>>>>> origin/main
</div>

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

    .links {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1rem;
    }

    .links a {
        color: #007bff;
        text-decoration: none;
        margin-top: 0.5rem;
    }

    .links a:hover {
        text-decoration: underline;
    }
</style>
