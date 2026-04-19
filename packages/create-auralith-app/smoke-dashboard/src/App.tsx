import { Card, SectionLabel, TableToolbar, DataTable } from 'auralith-ui'

type Row = {
  project: string
  status: string
  owner: string
}

const rows: Row[] = [
  { project: 'Auralith Landing', status: 'Active', owner: 'Team A' },
  { project: 'Customer Dashboard', status: 'In Review', owner: 'Team B' },
  { project: 'Analytics Hub', status: 'Paused', owner: 'Team C' },
]

export function App() {
  return (
    <main className="page">
      <div className="container">
        <header>
          <SectionLabel>dashboard template</SectionLabel>
          <h1>smoke-dashboard</h1>
          <p>Starter dashboard scaffold with table + toolbar foundation.</p>
        </header>

        <section className="metrics">
          <Card className="metric" variant="subtle">
            <SectionLabel>leads</SectionLabel>
            <strong>127</strong>
          </Card>
          <Card className="metric" variant="subtle">
            <SectionLabel>conversion</SectionLabel>
            <strong>8.4%</strong>
          </Card>
          <Card className="metric" variant="subtle">
            <SectionLabel>tickets</SectionLabel>
            <strong>12</strong>
          </Card>
        </section>

        <section className="table-area">
          <TableToolbar searchPlaceholder="Search project..." searchValue="" />
          <DataTable<Row>
            columns={[
              { key: 'project', header: 'Project' },
              { key: 'status', header: 'Status' },
              { key: 'owner', header: 'Owner' },
            ]}
            data={rows}
          />
        </section>
      </div>
    </main>
  )
}
