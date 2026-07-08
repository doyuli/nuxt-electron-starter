<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertCircle, Bug, CheckCircle2, ExternalLink, FolderOpen, Loader2, PlugZap } from '@lucide/vue'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'

defineProps<{
  class?: HTMLAttributes['class']
}>()

type ProbeState
  = | { status: 'loading', message: string, bridgeAvailable: boolean }
    | { status: 'ready', version: string, bridgeAvailable: true }
    | { status: 'error', message: string, bridgeAvailable: boolean }

const initialProbeState: ProbeState = {
  status: 'loading',
  message: 'Checking preload bridge...',
  bridgeAvailable: false,
}

const state = ref<ProbeState>(initialProbeState)

const hasBridge = computed(() => state.value.bridgeAvailable)
const StatusIcon = computed(() => state.value.status === 'ready' ? CheckCircle2 : state.value.status === 'error' ? AlertCircle : Loader2)

onMounted(async () => {
  const api = window.electronAPI

  if (!api) {
    queueMicrotask(() => {
      state.value = {
        status: 'error',
        message: 'Preload bridge is only available inside Electron.',
        bridgeAvailable: false,
      }
    })
    return
  }

  try {
    const version = await api.app.getVersion()
    state.value = {
      status: 'ready',
      version,
      bridgeAvailable: true,
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown preload bridge error'
    state.value = {
      status: 'error',
      message,
      bridgeAvailable: true,
    }
  }
})

function openFileDialog() {
  void window.electronAPI?.dialog.openFile()
}

function toggleDevTools() {
  void window.electronAPI?.window.toggleDevTools()
}

function openElectronDocs() {
  void window.electronAPI?.shell.openExternal('https://www.electronjs.org/')
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-2">
        <span
          :class="cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md',
            state.status === 'ready' && 'bg-emerald-50 text-emerald-700',
            state.status === 'loading' && 'bg-muted text-muted-foreground',
            state.status === 'error' && 'bg-red-50 text-destructive',
          )"
        >
          <component
            :is="StatusIcon"
            :class="cn('size-4', state.status === 'loading' && 'animate-spin')"
            aria-hidden="true"
          />
        </span>
        <div class="min-w-0">
          <CardTitle>Preload IPC Bridge</CardTitle>
          <CardDescription>Typed renderer access through Electron contextBridge.</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="rounded-md border bg-muted/40 px-3 py-2 text-sm">
        <p v-if="state.status === 'loading'" class="text-muted-foreground">
          {{ state.message }}
        </p>
        <p v-else-if="state.status === 'ready'">
          Connected to Electron. App version: <code>{{ state.version }}</code>
        </p>
        <p v-else-if="state.status === 'error'" class="text-destructive">
          {{ state.message }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          :disabled="!hasBridge"
          @click="openFileDialog"
        >
          <FolderOpen class="size-4" aria-hidden="true" />
          Open File Dialog
        </Button>
        <Button
          type="button"
          variant="outline"
          :disabled="!hasBridge"
          @click="toggleDevTools"
        >
          <Bug class="size-4" aria-hidden="true" />
          Toggle DevTools
        </Button>
        <Button
          type="button"
          variant="outline"
          :disabled="!hasBridge"
          @click="openElectronDocs"
        >
          <ExternalLink class="size-4" aria-hidden="true" />
          Electron Docs
        </Button>
      </div>
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <PlugZap class="size-3.5" aria-hidden="true" />
        <span>{{ hasBridge ? 'Renderer bridge is available.' : 'Renderer bridge is waiting for Electron.' }}</span>
      </div>
    </CardContent>
  </Card>
</template>
