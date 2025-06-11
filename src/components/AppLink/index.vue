<template>
  <component :is="linkType" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
  import { isExternal } from '@/utils/index';

  const props = defineProps({
    to: {
      type: [String, Object],
      required: true
    }
  });

  const isExternalLink = computed(() => {
    return isExternal(props.to.path || '');
  });

  const linkType = computed(() => (isExternalLink.value ? 'a' : 'router-link'));

  function linkProps(to) {
    if (isExternalLink.value) {
      return {
        href: to.path,
        target: '_blank',
        // 安全最佳实践，防止潜在的安全问题。
        rel: 'noopener noreferrer'
      };
    }
    return { to };
  }
</script>
