<script setup lang="ts">
import type { Component } from 'vue'
import { AppWindow, Cable, LayoutDashboard, Package, Settings } from '@lucide/vue'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const navItems: Array<{ href: string, label: string, icon: Component, active?: boolean }> = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard, active: true },
  { href: '#ipc', label: 'IPC', icon: Cable },
  { href: '#build', label: 'Build', icon: Package },
]
</script>

<template>
  <main class="min-h-screen bg-background text-foreground md:grid md:grid-cols-[260px_minmax(0,1fr)]">
    <aside class="border-b border-sidebar-border bg-sidebar px-5 py-5 text-sidebar-foreground md:min-h-screen md:border-b-0 md:border-r">
      <div class="mb-8 flex items-center gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <AppWindow class="size-5" aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <strong class="block truncate text-sm font-semibold">Electron Nuxt</strong>
          <span class="block text-xs text-sidebar-foreground/70">Starter</span>
        </div>
      </div>
      <nav class="grid gap-1" aria-label="Primary">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :class="cn(
            'flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors',
            item.active
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground',
          )"
        >
          <component :is="item.icon" class="size-4" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
    <section class="min-w-0 px-5 py-6 sm:px-8">
      <header class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold tracking-normal">
            Desktop App Template
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Electron shell, Nuxt renderer, typed preload bridge.
          </p>
        </div>
        <Button variant="outline" size="sm" as-child>
          <a href="#ipc">
            <Settings class="size-4" aria-hidden="true" />
            IPC Example
          </a>
        </Button>
      </header>
      <section id="overview" class="max-w-3xl">
        <slot />
      </section>
    </section>
  </main>
</template>
