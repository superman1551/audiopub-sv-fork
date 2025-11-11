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
    import { formatRelative } from "date-fns";
    import type { ClientsideComment, ClientsideUser } from "$lib/types";
    import Modal from "./modal.svelte";
    import { enhance } from "$app/forms";
    import SafeMarkdown from "./safe_markdown.svelte";
    import { t, locale } from "$lib/i18n";

    export let comment: ClientsideComment;
    export let user: ClientsideUser | undefined = undefined;
    export let isAdmin: boolean = false;
    let isDeletionModalVisible: boolean = false;
    let isEditModalVisible: boolean = false;
    let editContent: string = '';

    $: commentDate = comment
        ? formatRelative(new Date(comment.createdAt), new Date())
        : "";

    $: editContent = comment?.content ?? '';

    $: $locale;
</script>

<div class="comment">
    <h3>
        {#if comment.user && !comment.user.isTrusted}
            <span style="color: red">({t('comment.pending_review')})</span> |{" "}
        {/if}

        <a href={`/user/${comment.user.id}`}>{comment.user.displayName}</a>
        <span class="comment-date"> - {commentDate}</span>
    </h3>
    <SafeMarkdown source={comment.content} />
    {#if isAdmin || (user && user.id === comment.user.id)}
        <div id="comment-actions">
            <button on:click={() => (isEditModalVisible = true)}>{t('comment.edit')}</button>
            <button on:click={() => (isDeletionModalVisible = true)}
                >{t('comment.delete')}</button
            >
            <Modal ariaLabel={t('comment.delete_dialog_aria')} bind:visible={isDeletionModalVisible}>
                <h2>{t('comment.delete_confirm')}</h2>
                <p>{t('comment.delete_warning')}</p>
                <p>{t('comment.content')}:</p>
                <pre>{comment.content}</pre>
                <button on:click={() => (isDeletionModalVisible = false)}
                    >{t('comment.cancel')}</button
                >
                <form use:enhance action="?/delete_comment" method="post">
                    <input type="hidden" name="id" value={comment.id} />
                    <button type="submit">{t('comment.delete_confirm_button')}</button>
                </form>
            </Modal>

            <Modal ariaLabel={t('comment.edit_title')} bind:visible={isEditModalVisible}>
                <h2>{t('comment.edit_title')}</h2>
                <form
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      await update(result);
                      isEditModalVisible = false;
                    };
                  }}
                  action="?/edit_comment" method="post">
                    <input type="hidden" name="id" value={comment.id} />
                    <label for={`content-${comment.id}`}>{t('comment.content_label')}</label>
                    <textarea id={`content-${comment.id}`} name="content" rows="6" bind:value={editContent} minlength="3" maxlength="4000"></textarea>
                    <div class="modal-actions">
                        <button type="button" on:click={() => (isEditModalVisible = false)}>{t('common.cancel')}</button>
                        <button type="submit">{t('common.confirm')}</button>
                    </div>
                </form>
            </Modal>
        </div>
    {/if}
</div>

<style>
    .comment {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .comment h3 a {
        color: #007bff;
        text-decoration: none;
    }

    .comment .comment-date {
        color: #6c757d; /* A muted color for the date */
        font-size: 0.9em;
        margin-left: 0.5em;
    }

    .comment pre {
        white-space: pre-wrap;
        background-color: #fff;
        padding: 0.5rem;
        border: none;
        margin-top: 0.5rem;
    }

    .comment #comment-actions {
        margin-top: 0.5rem;
    }
</style>
