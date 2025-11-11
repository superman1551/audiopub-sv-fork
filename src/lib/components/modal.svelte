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
  export let visible: boolean;
  export let ariaLabel: string | undefined = undefined;
  let dialog: HTMLDialogElement;
  $: if (dialog) {
    if (visible) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (visible = false)}
  on:click|self={() => dialog.close()}
  aria-modal="true"
  aria-label={ariaLabel}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot />
  </div>
</dialog>

<style>
  dialog {
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  /* Global styles for modal actions */
  :global(.modal-actions) {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  
  :global(.modal-actions button) {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f8f9fa;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  :global(.modal-actions button:hover) {
    background-color: #e9ecef;
  }
  
  :global(.modal-actions button[type="submit"]) {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  
  :global(.modal-actions button[type="submit"]:hover) {
    background-color: #0056b3;
    border-color: #0056b3;
  }
</style>
