<script setup lang="ts">
import Radio from '~/components/Radio.vue'
import { settings } from '~/logic'

import SettingsItem from '../../components/SettingsItem.vue'
import SettingsItemGroup from '../../components/SettingsItemGroup.vue'
</script>

<template>
  <div>
    <SettingsItemGroup :title="$t('settings.group_favorites')">
      <SettingsItem
        :title="$t('settings.favorite_cover_blur')"
        :desc="$t('settings.favorite_cover_blur_desc')"
        right-width="auto"
      >
        <Radio v-model="settings.enableFavoriteCoverBlur" />
      </SettingsItem>
    </SettingsItemGroup>
  </div>
</template>
