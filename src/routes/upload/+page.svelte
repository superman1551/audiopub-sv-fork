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
    import { t, locale } from "$lib/i18n";
    $: { $locale; title.set(t('title.upload')); }
    let submitting = false;
</script>

<h1>{t('upload.h1')}</h1>

<form
    use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
            await update();
            submitting = false;
        };
    }}
    method="POST"
    enctype="multipart/form-data"
>
    <div class="form-group">
        <label for="title">{t('upload.title')}</label>
        <input
            type="text"
            id="title"
            name="title"
            required
            minlength="3"
            maxlength="120"
            class="form-control"
        />
    </div>
    <div class="form-group">
        <label for="description">Description:</label>
        <textarea
            id="description"
            name="description"
            maxlength="5000"
            class="form-control"
        ></textarea>
    </div>
    <div class="form-group">
        <label for="audio">{t('upload.file')}</label>
        <input
            type="file"
            id="audio"
            name="file"
            required
            class="form-control"
        />
    </div>
    <p class="info">
        {t('upload.info.formats')}
    </p>
    <p class="info">
        {t('upload.info.rules')}
    </p>
    <button type="submit" class="btn" disabled={submitting}
        >{#if submitting}{t('upload.submitting')}{:else}{t('upload.submit')}{/if}</button
    >
</form>

<style>
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
        max-width: 600px;
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
        width: 100%;
    }

    .form-control:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .info {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
        text-align: center;
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

    .btn:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
</style>
