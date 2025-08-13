<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let fullWidth = false;
  export let loading = false;
  export let onClick: (() => void) | undefined = undefined;

  // Compute classes based on props
  $: variantClasses = {
    primary: 'bg-sky-400 text-slate-50 hover:bg-sky-500 focus:ring-sky-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-sky-300',
    secondary: 'bg-sky-300 text-slate-50 hover:bg-sky-400 focus:ring-sky-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-sky-200',
    outline: 'bg-sky-50 border-2 border-sky-400 text-sky-700 hover:bg-sky-100 focus:ring-sky-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200',
    ghost: 'bg-transparent text-sky-600 hover:bg-sky-50 focus:ring-sky-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
    link: 'bg-transparent text-sky-600 hover:underline focus:ring-sky-400 p-0 shadow-none transform-none',
    destructive: 'bg-red-400 text-slate-50 hover:bg-red-500 focus:ring-red-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-2 border-red-300',
  }[variant];

  $: sizeClasses = {
    sm: 'text-sm px-3 py-1.5 h-8',
    md: 'text-base px-4 py-2 h-10',
    lg: 'text-lg px-6 py-3 h-12',
  }[size];

  $: widthClass = fullWidth ? 'w-full' : '';
</script>

<button
  {type}
  class="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none {variantClasses} {sizeClasses} {widthClass}"
  {disabled}
  on:click={onClick}
  {...$$restProps}
>
  {#if loading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  <slot />
</button>