<script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let shadow: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let rounded: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let border: boolean = true;

  $: paddingClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  }[padding];

  $: shadowClass = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  }[shadow];

  $: roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
  }[rounded];

  $: borderClass = border ? 'border border-gray-200' : '';
</script>

<div class="bg-white {paddingClass} {shadowClass} {roundedClass} {borderClass} {$$props.class || ''}">
  <slot />
</div>

<slot name="footer" />