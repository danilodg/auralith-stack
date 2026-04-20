import { Avatar, Button, DataTable, SectionLabel, Select, TableToolbar, Tag } from 'auralith-ui'
import type { Lifecycle, Period, ProjectRow, Segment } from '../data'

type ProjectsTableProps = {
  text: any
  period: Period
  setPeriod: (val: Period) => void
  segment: Segment
  setSegment: (val: Segment) => void
  lifecycle: Lifecycle
  setLifecycle: (val: Lifecycle) => void
  search: string
  setSearch: (val: string) => void
  rows: ProjectRow[]
}

export function ProjectsTable({
  text,
  period,
  setPeriod,
  segment,
  setSegment,
  lifecycle,
  setLifecycle,
  search,
  setSearch,
  rows,
}: ProjectsTableProps) {
  return (
    <section className="table-area">
      <SectionLabel>{text.section}</SectionLabel>
      <h2 className="section-title">{text.title}</h2>
      <div className="filter-grid">
        <Select label={text.filters?.period || 'Periodo'} onValueChange={(value) => setPeriod(value as Period)} value={period}>
          <Select.Option description={text.filters?.periodOptions['7d']?.description} label={text.filters?.periodOptions['7d']?.label || '7 dias'} value="7d" />
          <Select.Option description={text.filters?.periodOptions['30d']?.description} label={text.filters?.periodOptions['30d']?.label || '30 dias'} value="30d" />
          <Select.Option description={text.filters?.periodOptions['90d']?.description} label={text.filters?.periodOptions['90d']?.label || '90 dias'} value="90d" />
        </Select>
        <Select label={text.filters?.segment || 'Segmento'} onValueChange={(value) => setSegment(value as Segment)} value={segment}>
          <Select.Option description={text.filters?.segmentOptions.all.description} label={text.filters?.segmentOptions.all.label} value="all" />
          <Select.Option description={text.filters?.segmentOptions.smb.description} label={text.filters?.segmentOptions.smb.label} value="smb" />
          <Select.Option description={text.filters?.segmentOptions.mid.description} label={text.filters?.segmentOptions.mid.label} value="mid" />
          <Select.Option description={text.filters?.segmentOptions.enterprise.description} label={text.filters?.segmentOptions.enterprise.label} value="enterprise" />
        </Select>
        <Select label={text.filters?.lifecycle || 'Status'} onValueChange={(value) => setLifecycle(value as Lifecycle)} value={lifecycle}>
          <Select.Option description={text.filters?.lifecycleOptions.all.description} label={text.filters?.lifecycleOptions.all.label} value="all" />
          <Select.Option description={text.filters?.lifecycleOptions.trial.description} label={text.filters?.lifecycleOptions.trial.label} value="trial" />
          <Select.Option description={text.filters?.lifecycleOptions.active.description} label={text.filters?.lifecycleOptions.active.label} value="active" />
          <Select.Option description={text.filters?.lifecycleOptions['at-risk'].description} label={text.filters?.lifecycleOptions['at-risk'].label} value="at-risk" />
        </Select>
      </div>
      <TableToolbar
        onSearchValueChange={setSearch}
        primaryAction={<Button variant="secondary">{text.cta}</Button>}
        searchPlaceholder={text.search}
        searchValue={search}
      />
      <DataTable<ProjectRow>
        columns={[
          { key: 'account', header: text.columns.account },
          {
            key: 'segment',
            header: text.columns.segment,
            render: (row) => text.segments?.[row.segment] || row.segment,
          },
          {
            key: 'lifecycle',
            header: text.columns.lifecycle,
            render: (row) => (
              <Tag className={`status-tag ${row.health}`}>{text.lifecycle?.[row.lifecycle] || row.lifecycle}</Tag>
            ),
          },
          { key: 'mrr', header: text.columns.mrr, align: 'right' },
          { 
            key: 'owner', 
            header: text.columns.owner,
            render: (row) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Avatar fallback={row.owner} size="sm" />
                <span>{row.owner}</span>
              </div>
            )
          },
          { key: 'renewal', header: text.columns.renewal, align: 'right' },
        ]}
        data={rows}
        empty={text.empty}
      />
    </section>
  )
}
