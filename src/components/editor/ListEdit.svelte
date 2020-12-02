<script>
  import { _ } from 'svelte-i18n';
  import {
    DataTable,
    Toolbar,
    ToolbarBatchActions,
    ToolbarContent,
  } from 'carbon-components-svelte/src/DataTable';
  import { Button } from 'carbon-components-svelte/src/Button';
  import Add16 from 'carbon-icons-svelte/lib/Add16';
  import TrashCan16 from 'carbon-icons-svelte/lib/TrashCan16';
  import hotkeys from 'hotkeys-js';

  export let fields = [];
  export let rows = [];
  export let empty = {};
  export let selected;

  $: if (!(selected in rows)) {
    selected = -1;
    selectedRowIds = [];
  }
  let selectedRowIds = selected in rows ? [rows[selected].id] : [];

  $: headers = fields.concat({ key: 'ops', value: $_('operations'), sort: () => 0 });
  $: lastid = rows.reduce((p, c) => Math.max(p, c.id), -1);
  $: selected = rows.findIndex(r => r.id === selectedRowIds[selectedRowIds.length - 1]);

  const remove = (...ids) => {
    rows = rows.filter(d => !ids.includes(d.id));
  };

  const add = () => {
    rows = rows.concat({
      ...empty,
      id: lastid + 1,
    });
  };
</script>

<DataTable
  {...$$restProps}
  size="short"
  {headers}
  {rows}
  sortable
  stickyHeader
  bind:selectedRowIds
  on:click:row={({ detail }) => {
    if (hotkeys.isPressed('ctrl')) {
      if (selectedRowIds.includes(detail.id)) {
        selectedRowIds = selectedRowIds.filter(id => id !== detail.id);
      } else {
        selectedRowIds = selectedRowIds.concat(detail.id);
      }
    } else {
      if (selectedRowIds.length === 1 && selectedRowIds.includes(detail.id)) {
        selectedRowIds = [];
      } else {
        selectedRowIds = [detail.id];
      }
    }
  }}
>
  <span slot="cell" let:row let:cell>
    {#if cell.key === 'ops'}
      <Button
        hasIconOnly
        kind="danger-tertiary"
        size="small"
        iconDescription={$_('delete')}
        icon={TrashCan16}
        on:click={() => remove(row.id)}
      />
    {:else}
      {cell.value}
    {/if}
  </span>
  <Toolbar size="sm">
    <ToolbarBatchActions>
      <Button
        icon={TrashCan16}
        on:click={() => remove(...selectedRowIds)}
      >
        {$_('delete')}
      </Button>
    </ToolbarBatchActions>
    <ToolbarContent>
      <Button
        icon={Add16}
        on:click={add}
      >
        {$_('add')}
      </Button>
    </ToolbarContent>
  </Toolbar>
</DataTable>
