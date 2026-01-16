<template>
  <div>
    <div id="swagger-ui"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import 'swagger-ui-dist/swagger-ui.css';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

onMounted(() => {
  SwaggerUIBundle({
    url: '/openapi-mobileid.yaml',
    dom_id: '#swagger-ui',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
  });
});
</script>