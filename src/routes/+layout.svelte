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
<<<<<<< HEAD
    import title from "$lib/title";
    import { onDestroy, onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import { t, locale, availableLocales } from "$lib/i18n";
=======
    import { enhance } from "$app/forms";
    import title from "$lib/title";
    import { onDestroy, onMount } from "svelte";
    import type { LayoutData } from "./$types";
>>>>>>> origin/main

    export let data: LayoutData;

    let unreadCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let backoffMs = 60000;
    const maxBackoff = 5 * 60_000;
    const minBackoff = 30_000;
    let inFlight = false;
    let lastFetchTs = 0;
    const MIN_IMMEDIATE_INTERVAL = 20000;

    async function refreshUnread() {
        if (!data.user) return;
        if (document.visibilityState === "hidden") return;
        if (inFlight) return;
        
        try {
            inFlight = true;
            const ctrl = new AbortController();
            const timeoutId = setTimeout(() => ctrl.abort(), 8000);
            const res = await fetch("/notifications", {
                signal: ctrl.signal,
                headers: { "cache-control": "no-cache" },
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error(String(res.status));
            const body = await res.json();
            unreadCount = Number(body?.unread ?? 0) || 0;
            
            // Reset backoff on success
            backoffMs = 60000;
        } catch (e) {
            backoffMs = Math.min(
                Math.max(backoffMs * 2, minBackoff),
                maxBackoff
            );
        } finally {
            lastFetchTs = Date.now();
            inFlight = false;
        }
    }

    function scheduleNext() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(async () => {
            await refreshUnread();
            scheduleNext();
        }, backoffMs);
    }

    function kickImmediate() {
        const now = Date.now();
        if (inFlight) return;
        if (now - lastFetchTs < MIN_IMMEDIATE_INTERVAL) return;
        refreshUnread();
    }

    onMount(() => {
        refreshUnread().finally(scheduleNext);
        const onVis = () =>
            document.visibilityState === "visible" && kickImmediate();
        const onFocus = () => kickImmediate();
        document.addEventListener("visibilitychange", onVis);
        window.addEventListener("focus", onFocus);
        return () => {
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("focus", onFocus);
        };
    });

    onDestroy(() => {
        if (timer) clearTimeout(timer);
    });
</script>

<<<<<<< HEAD
<svelte:head>
    <title>{unreadCount > 0 ? `(${unreadCount}) ` : ""}{$title} | {t('title.brand')}</title></svelte:head>

<header>
    <nav aria-label={t('nav.primary')}>
        <a href="/">{t('nav.home')}</a>
        <a href="/quickfeed">{t('nav.quickfeed')}</a>
        {#if data.user}
            {#if !data.user.isVerified}
                <p>
                    <b>{t('layout.warning_label')}</b> {t('layout.verify_warning')}
                </p>
                <a href="/verify">{t('verify.button')}</a>
            {:else}
                <a href="/notifications" class="notifications-link">
                    {t('nav.notifications')}
                    {#if unreadCount > 0}
                        <span
                            class="badge"
                            aria-label={t('notifications.unread_badge', { count: unreadCount })}
=======
<svelte head>
    <title
        >{unreadCount > 0 ? `(${unreadCount}) ` : ""}{$title} | audiopub</title
    >
</svelte>

<header>
    <nav>
        <a href="/">Home</a>
        <a href="/quickfeed">Quickfeed</a>
        {#if data.user}
            {#if !data.user.isVerified}
                <p>
                    <b>WARNING:</b> Your account is not verified. Please verify your
                    account to access all features.
                </p>
                <a href="/verify">Verify</a>
            {:else}
                <a href="/notifications" class="notifications-link">
                    Notifications
                    {#if unreadCount > 0}
                        <span
                            class="badge"
                            aria-label={`${unreadCount} unread notifications`}
>>>>>>> origin/main
                            >{unreadCount}</span
                        >
                    {/if}
                </a>
<<<<<<< HEAD
                <a href="/favorites">{t('nav.favorites')}</a>
                <a href="/upload">{t('nav.upload')}</a>
                <a href="/profile">{t('nav.profile')}</a>
                <a href="/logout">{t('nav.logout')}</a>
            {/if}
        {:else}
            <a href="/login">{t('nav.login')}</a>
            <a href="/register">{t('nav.register')}</a>
        {/if}
    </nav>
    <form action="/search" method="get" role="search" aria-label={t('search.aria_label')}>
        <input type="text" name="q" placeholder={t('search.placeholder')} />
        <button type="submit">{t('search.button')}</button>
    </form>
    <div class="locale-switcher">
        <label for="locale">{t('idioma')}:</label>
        <select
            id="locale"
            bind:value={$locale}
            on:change={(e) => locale.set((e.target as HTMLSelectElement).value as typeof $locale)}
        >
            {#each availableLocales as l}
                <option value={l.code}>{l.nativeName}</option>
            {/each}
        </select>
    </div>
=======
                <a href="/favorites">Favorites</a>
                <a href="/upload">Upload</a>
                <a href="/profile">Profile</a>
                <a href="/logout">Logout</a>
            {/if}
        {:else}
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        {/if}
    </nav>
    <form action="/search" method="get">
        <input type="text" name="q" placeholder="Search..." />
        <button type="submit">Search</button>
    </form>
>>>>>>> origin/main
</header>
<main>
    <slot />
</main>

<hr />
<footer>
    <div class="copyright">
<<<<<<< HEAD
        <p>{t('footer.rights')}</p>
        <p>
            {t('footer.contact')}:
            <a href="mailto:cccefg2@gmail.com"> cccefg2@gmail.com</a>
            {t('footer.email_note')}
        </p>
        <a href="/agreement">{t('footer.agreement')}</a>
        <p>
            {t('footer.open_source')}
=======
        <p>
            All rights to the audio files and associated content uploaded to
            this platform remain with their respective creators or rightful
            owners.
        </p>
        <p>
            For inquiries regarding content ownership or usage, please contact:
            <a href="mailto:cccefg2@gmail.com"> cccefg2@gmail.com</a>
            I'm sorry for the unprofessional email address, I'm still working on
            it.
        </p>
        <a href="/agreement">Our Agreement</a>
        <p>
            Audiopub is open source software. The code is licensed under the GNU
            AFFERO GENERAL PUBLIC LICENSE. You can find the source code on
>>>>>>> origin/main
            <a href="https://github.com/the-byte-bender/audiopub-sv">GitHub</a>.
        </p>
    </div>
</footer>

<style>
    header {
        background-color: #f0f0f0;
        padding: 20px;
<<<<<<< HEAD
        display: grid;
        grid-template-columns: 1fr auto auto;
=======
        display: flex;
        justify-content: space-between;
>>>>>>> origin/main
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
<<<<<<< HEAD
        gap: 1rem;
=======
>>>>>>> origin/main
    }

    nav a {
        margin-right: 10px;
        text-decoration: none;
        color: #333;
    }

    nav a:hover {
        color: #000;
    }

    .notifications-link {
        font-weight: 600;
        position: relative;
    }
    .badge {
        margin-left: 0.4rem;
        background: #d00;
        color: #fff;
        border-radius: 999px;
        padding: 0 0.45rem;
        font-size: 0.8rem;
        line-height: 1.2rem;
        display: inline-block;
        min-width: 1.2rem;
        text-align: center;
    }

    main {
        padding: 20px;
        /* Account for sticky header - approximate height is 80px (40px padding + ~40px content) */
        padding-top: calc(20px + 80px);
    }

    footer {
        background-color: #eee;
        padding: 20px;
        text-align: center;
    }
<<<<<<< HEAD

    .locale-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
=======
>>>>>>> origin/main
</style>
