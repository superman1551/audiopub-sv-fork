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
    import Modal from "./modal.svelte";
    import { t } from "$lib/i18n";
    export let href: string;
    export let title: string;

    const trustedSchemas = ["http:", "https:", "mailto:", "tel:", "ftp:"];

    function sanitizeUrl(url: string): string | null {
        try {
            let cleanUrl = url.trim();
            const lowerUrl = cleanUrl.toLowerCase();

            if (!trustedSchemas.some((schema) => lowerUrl.startsWith(schema))) {
                if (cleanUrl.includes(".") && !cleanUrl.startsWith("/")) {
                    cleanUrl = `https://${cleanUrl}`;
                } else {
                    return null;
                }
            }

            const finalLowerUrl = cleanUrl.toLowerCase();
            const hasTrustedSchema = trustedSchemas.some((schema) =>
                finalLowerUrl.startsWith(schema)
            );

            if (!hasTrustedSchema) {
                return null;
            }

            new URL(cleanUrl);
            return cleanUrl;
        } catch {
            return null;
        }
    }

    // Internal links (site routes) should work directly and be fully accessible
    $: rawHref = (href || "").trim();
    $: isInternal = rawHref.startsWith("/");
    $: safeHref = isInternal ? rawHref : sanitizeUrl(rawHref);
    let confirmVisible = false;

    function confirmOpen(e: MouseEvent) {
        if (!safeHref) return;
        e.preventDefault();
        confirmVisible = true;
    }

    function openLink() {
        if (!safeHref) return;
        window.open(safeHref, "_blank", "noopener,noreferrer");
        confirmVisible = false;
    }
</script>

{#if safeHref}
    {#if isInternal}
        <!-- Internal link: navigate normally without confirmation -->
        <a href={safeHref} {title}>
            <slot />
        </a>
    {:else}
        <!-- External link: show confirmation modal before opening in new tab -->
        <a
            href={safeHref}
            {title}
            target="_blank"
            rel="noopener noreferrer nofollow"
            on:click|preventDefault={confirmOpen}
        >
            <slot />
        </a>
        <Modal ariaLabel={t('untrusted.open_dialog_aria')} bind:visible={confirmVisible}>
            <h2>{t('untrusted.open_title')}</h2>
            <p>{t('untrusted.open_text')}</p>
            <p style="word-break: break-all"><strong>{safeHref}</strong></p>
            <div
                style="display: flex; gap: .5rem; margin-top: .75rem; flex-wrap: wrap;"
            >
                <button on:click={() => (confirmVisible = false)}>{t('common.cancel')}</button>
                <button on:click={openLink}>{t('untrusted.open_btn')}</button>
            </div>
        </Modal>
    {/if}
{/if}

<style>
    a {
        cursor: pointer;
    }
    button {
        cursor: pointer;
    }
</style>
