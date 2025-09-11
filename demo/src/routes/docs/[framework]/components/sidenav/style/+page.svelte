<script lang="ts">
	import Section from '$lib/layout/Section.svelte';
	import StyleCode from '$lib/layout/StyleCode.svelte';
	import sidenavCssVars from '@agnos-ui/styles/core-bootstrap/sidenav?sidenav-css-vars';
	import sidenavVars from '@agnos-ui/styles/core-bootstrap/_variables?sidenav-vars';
</script>

<p>
	You will need to import the styles defined in <code>@agnos-ui/core-bootstrap/css/sidenav.css</code> or
	<code>@agnos-ui/core-bootstrap/scss/sidenav.scss</code>
	<br />
	These styles are also exported in the global export <code>@agnos-ui/core-bootstrap/css/agnosui.css</code> or
	<code>@agnos-ui/core-bootstrap/scss/agnosui.scss</code>
</p>

<Section label="CSS Variables" level={2}>
	<StyleCode style={sidenavCssVars} />
</Section>

<Section label="SCSS Variables" level={2}>
	<StyleCode style={sidenavVars} />
</Section>
