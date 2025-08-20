<script lang="ts">
	import Section from '$lib/layout/Section.svelte';
	import StyleCode from '$lib/layout/StyleCode.svelte';
	import drawerCssVars from '@agnos-ui/styles/core-bootstrap/drawer?drawer-css-vars';
	import drawerVars from '@agnos-ui/styles/core-bootstrap/_variables?drawer-vars';
</script>

<p>
	You will need to import the styles defined in <code>@agnos-ui/core-bootstrap/css/drawer.css</code> or
	<code>@agnos-ui/core-bootstrap/scss/drawer.scss</code>
	<br />
	These styles are also exported in the global export <code>@agnos-ui/core-bootstrap/css/agnosui.css</code> or
	<code>@agnos-ui/core-bootstrap/scss/agnosui.scss</code>
</p>

<Section label="CSS Variables" level={2}>
	<StyleCode style={drawerCssVars} />
</Section>

<Section label="SCSS Variables" level={2}>
	<StyleCode style={drawerVars} />
</Section>
