const DataTable = ({ columns, data, emptyLabel = 'No records yet.' }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          {columns.map((column) => (
            <th key={column.Header} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">
              {emptyLabel}
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row.id || JSON.stringify(row)} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.Header} className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor] ?? '—'}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
