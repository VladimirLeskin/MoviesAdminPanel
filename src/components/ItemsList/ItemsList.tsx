import React, {FC} from 'react';

interface IListItem {
  [key: string]: any;
}

interface IListColumn {
  id: string;
  width?: number;
  title: string;
  renderer?: React.ComponentType<{ data: any }>;
}

interface ItemsListProps {
  data: IListItem[];
  columns: IListColumn[];
}

export const ItemsList: FC<ItemsListProps> = ({data, columns}) => {
  return (
    <div>
      <table>
        <thead>
          {columns.map(c => (
            <th key={c.id}>{c.title}</th>
          ))}
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index}>
              {columns.map(c => {
                const Cell = c.renderer ?? DefaultCell;
                return (
                  <td key={c.id}>
                    <Cell data={d[c.id]} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function DefaultCell({data}: { data: any }) {
  return <>{String(data)}</>;
}
