<script lang="ts">
  export let id: string;
  export let name: string;
  export let type: string = 'text';
  export let placeholder: string = '';
  export let value: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let fullWidth: boolean = false;
</script>

<div class="{fullWidth ? 'w-full' : ''}">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  {/if}
  <input
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    {disabled}
    bind:value
    class="px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 block rounded-md sm:text-sm focus:ring-1 {error ? 'border-red-500' : ''} {fullWidth ? 'w-full' : ''}"
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    {...$$restProps}
  />
  {#if error}
    <p id="{id}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>